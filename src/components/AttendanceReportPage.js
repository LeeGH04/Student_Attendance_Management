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
    const [isLoading, setIsLoading] = useState(true);
    const studentId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!studentId) return;

            try {
                console.log("Fetching data for student:", studentId);
                const response = await axios.get(
                    `http://localhost:5002/api/attendance/report/student/${studentId}`
                );
                console.log("Raw response:", response);

                if (response.data && response.data.success) {
                    console.log("Setting attendance data:", response.data.data);
                    setAttendanceData(response.data.data);
                } else {
                    console.log("No data or error in response:", response.data);
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
    }, [studentId]);

    // 데이터 로드 중
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // 데이터가 없는 경우
    if (!attendanceData.details.length && !attendanceData.summary.length) {
        return <div>No attendance data available.</div>;
    }

    // 나머지 JSX 코드...
    // 나머지 렌더링 코드...

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
                            {attendanceData.details?.length > 0 ? (
                                attendanceData.details.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.courseName}</td>
                                        <td>{item.week}주차</td>
                                        <td>{formatDate(item.date)}</td>
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
                        {pieData.length > 0 && (
                            <div className={styles.chartContainer}>
                                <h2>전체 출결 현황</h2>
                                <div className={styles.pieChartWrapper}>
                                    <PieChart width={350} height={250}>
                                        <Pie
                                            data={pieData}
                                            cx={160}
                                            cy={100}
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({name, value, percent}) =>
                                                `${name}: ${value}회 (${(percent * 100).toFixed(1)}%)`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value}회`}/>
                                        <Legend />
                                    </PieChart>
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
                                        <YAxis/>
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