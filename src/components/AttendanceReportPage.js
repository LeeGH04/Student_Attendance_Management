import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';
import styles from '../css/AttendanceReportPage.module.css';
import '../css/Base.css';

// 클라이언트 코드 (AttendanceReportPage.js)
// AttendanceReportPage.js
const AttendanceReportPage = () => {
    const [attendanceData, setAttendanceData] = useState({
        details: [],
        summary: []
    });
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');

    // 부모인 경우 자녀 목록 조회
    useEffect(() => {
        const fetchChildren = async () => {
            if (userRole === 'parent') {
                try {
                    const response = await axios.get(`http://localhost:5002/api/parent/children/${userId}`);
                    setChildren(response.data);
                    if (response.data.length > 0) {
                        setSelectedChild(response.data[0].id);  // 첫 번째 자녀 선택
                    }
                } catch (error) {
                    console.error('자녀 목록 조회 실패:', error);
                }
            }
        };

        fetchChildren();
    }, [userId, userRole]);

    // 출석 데이터 조회
    useEffect(() => {
        const fetchAttendanceData = async () => {
            const studentToCheck = userRole === 'parent' ? selectedChild : userId;
            if (!studentToCheck) return;

            try {
                setIsLoading(true);
                console.log("Fetching data for student:", studentToCheck);

                const response = await axios.get(
                    `http://localhost:5002/api/attendance/report/student/${studentToCheck}`
                );

                if (response.data && response.data.success) {
                    setAttendanceData(response.data.data);
                } else {
                    setAttendanceData({ details: [], summary: [] });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setAttendanceData({ details: [], summary: [] });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendanceData();
    }, [userId, userRole, selectedChild]);

    // 데이터 로드 중
    if (isLoading) {
        return (
            <div className="main-container">
                <div className="content-container">
                    <h1 className="title">출석 보고서</h1>
                    <div className={styles.container}>
                        <div className={styles.leftSection}>
                            <h2>상세 출결 현황</h2>
                            <div className={styles.loadingState}>
                                로딩 중...
                            </div>
                        </div>
                        <div className={styles.rightSection}>
                            <div className={styles.loadingState}>
                                로딩 중...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 데이터가 없는 경우
    if (!attendanceData.details.length && !attendanceData.summary.length) {
        return (
            <div className="main-container">
                <div className="content-container">
                    <h1 className="title">출석 보고서</h1>
                    <div className={styles.container}>
                        <div className={styles.leftSection}>
                            <h2>상세 출결 현황</h2>
                            <table className={styles.attendanceTable}>
                                <thead>
                                <tr>
                                    <th>강의명</th>
                                    <th>주차</th>
                                    <th>날짜</th>
                                    <th>출결상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan="4" className={styles.noDataMessage}>
                                        출결 기록이 없습니다.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.rightSection}>
                            <div className={styles.chartContainer}>
                                <h2>전체 출결 현황</h2>
                                <div className={styles.noDataMessage}>
                                    출결 데이터가 없습니다.
                                </div>
                            </div>
                            <div className={styles.chartContainer}>
                                <h2>과목별 출결 현황</h2>
                                <div className={styles.noDataMessage}>
                                    출결 데이터가 없습니다.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const totalAttendance = attendanceData.summary?.reduce((sum, item) => sum + (item.attendance || 0), 0) || 0;
    const totalTardiness = attendanceData.summary?.reduce((sum, item) => sum + (item.tardiness || 0), 0) || 0;
    const totalAbsence = attendanceData.summary?.reduce((sum, item) => sum + (item.absence || 0), 0) || 0;

    const pieData = [
        {name: '출석', value: totalAttendance, color: '#4CAF50'},
        {name: '지각', value: totalTardiness, color: '#FFC107'},
        {name: '결석', value: totalAbsence, color: '#F44336'}
    ].filter(item => item.value > 0);

    const statusMap = {
        'present': '출석',
        'late': '지각',
        'absent': '결석',
        'early_leave': '조퇴'
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };


    return (
        <div className="main-container">
            <div className="content-container">
                <h1 className="title">출석 보고서</h1>
                {/* 부모인 경우 자녀 선택 드롭다운 추가 */}
                {userRole === 'parent' && (
                    <div className={styles.childSelector}>
                        <select
                            value={selectedChild || ''}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className={styles.selectBox}
                        >
                            {children.map(child => (
                                <option key={child.id} value={child.id}>
                                    {child.name} ({child.id})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className={styles.container}>
                    <div className={styles.leftSection}>
                        <h2>상세 출결 현황</h2>
                        <table className={styles.attendanceTable}>
                            <thead>
                            <tr>
                                <th>강의명</th>
                                <th>주차</th>
                                {/*<th>날짜</th> 날짜 구현 못하겠음( 다 갈아 엎기 무셔웡~)*/}
                                <th>출결상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {attendanceData.details?.length > 0 ? (
                                attendanceData.details.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.courseName}</td>
                                        <td>{item.week}주차</td>
                                        {/*<td>{formatDate(item.date)}</td>날짜 구현 못하겠음( 다 갈아 엎기 무셔웡~)*/}
                                        <td className={styles[item.attendance_status]}>
                                            {statusMap[item.attendance_status]}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center'}}>
                                        출결 기록이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.rightSection}>
                        {attendanceData.summary?.length > 0 && (
                            <div className={styles.chartContainer}>
                                <h2>전체 출결 현황</h2>
                                <div className={styles.barChartWrapper}>
                                    <BarChart
                                        width={350}
                                        height={250}
                                        data={[{
                                            name: '전체',
                                            출석: totalAttendance,
                                            지각: totalTardiness,
                                            결석: totalAbsence
                                        }]}
                                        margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis ticks={Array.from({length: Math.max(totalAttendance, totalTardiness, totalAbsence)}, (_, i) => i + 1)}/>
                                        <Tooltip formatter={(value) => `${value}회`}/>
                                        <Legend/>
                                        <Bar
                                            dataKey="출석"
                                            fill="#4CAF50"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                        <Bar
                                            dataKey="지각"
                                            fill="#FFC107"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                        <Bar
                                            dataKey="결석"
                                            fill="#F44336"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                    </BarChart>
                                </div>
                            </div>
                        )}

                        {attendanceData.summary?.length > 0 && (
                            <div className={styles.chartContainer}>
                                <h2>과목별 출결 현황</h2>
                                <div className={styles.barChartWrapper}>
                                    <BarChart width={350} height={250} data={attendanceData.summary}
                                              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="courseName"/>
                                        <YAxis ticks={Array.from({length: Math.max(totalAttendance, totalTardiness, totalAbsence)}, (_, i) => i + 1)}/>
                                        <Tooltip formatter={(value) => `${value}회`}/>
                                        <Legend/>
                                        <Bar
                                            dataKey="attendance"
                                            name="출석"
                                            fill="#4CAF50"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                        <Bar
                                            dataKey="tardiness"
                                            name="지각"
                                            fill="#FFC107"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                        <Bar
                                            dataKey="absence"
                                            name="결석"
                                            fill="#F44336"
                                            label={{position: 'top', formatter: (value) => `${value}회`}}
                                        />
                                    </BarChart>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReportPage;