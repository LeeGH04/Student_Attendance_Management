import React from 'react';
import {BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';
import '../css/AttendanceReportPage.css';
import '../css/Base.css';

const AttendanceManagementPage = () => {
    const attendanceData = [
        {courseName: "시스템 분석 설계", studentId: "202344029", studentName: "이건휘", attendance: 10, tardiness: 2, absence: 1},
        {courseName: "JAVA프로그래밍", studentId: "202344029", studentName: "이건휘", attendance: 9, tardiness: 3, absence: 0},
        {courseName: "JAVA프로그래밍", studentId: "202344029", studentName: "이건휘", attendance: 9, tardiness: 3, absence: 0}
    ];

    // 전체 출결 상태 계산 (원형 그래프용)
    const totalAttendance = attendanceData.reduce((sum, item) => sum + item.attendance, 0);
    const totalTardiness = attendanceData.reduce((sum, item) => sum + item.tardiness, 0);
    const totalAbsence = attendanceData.reduce((sum, item) => sum + item.absence, 0);

    const pieData = [
        {name: '출석', value: totalAttendance, color: '#4CAF50'},
        {name: '지각', value: totalTardiness, color: '#FFC107'},
        {name: '결석', value: totalAbsence, color: '#F44336'}
    ];

    // 과목별 출결 상태 데이터 가공 (막대 그래프용)
    const barData = attendanceData.reduce((acc, curr) => {
        const existingCourse = acc.find(item => item.courseName === curr.courseName);
        if (existingCourse) {
            existingCourse.attendance += curr.attendance;
            existingCourse.tardiness += curr.tardiness;
            existingCourse.absence += curr.absence;
        } else {
            acc.push({
                courseName: curr.courseName,
                attendance: curr.attendance,
                tardiness: curr.tardiness,
                absence: curr.absence
            });
        }
        return acc;
    }, []);

    return (
        <div className="main-container">
            <div className="content-container">
                <h1 className="title">출석 보고서</h1>

                <div className="attendance-report-page-container">
                    <div className="attendance-report-page-left-section">

                            <h1>상세 출결 현황</h1>
                            <table className="attendance-table">
                                <thead>
                                <tr>
                                    <th>강의명</th>
                                    <th>학번</th>
                                    <th>이름</th>
                                    <th>출석</th>
                                    <th>지각</th>
                                    <th>결석</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attendanceData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.courseName}</td>
                                        <td>{item.studentId}</td>
                                        <td>{item.studentName}</td>
                                        <td>{item.attendance}</td>
                                        <td>{item.tardiness}</td>
                                        <td>{item.absence}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                    </div>
                    <div className="attendance-report-page-right-section">
                    {/* 전체 출결 현황 (원형 그래프) */}
                    <div className="chart-container">
                        <h2>전체 출결 현황</h2>
                        <div className="pie-chart-wrapper">
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
                                    label={({name, value, percent}) => `${name}: ${value}회 (${(percent * 100).toFixed(1)}%)`} // 라벨 추가
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color}/>
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}회`}/> {/* 툴팁 포맷 수정 */}
                                <Legend />
                            </PieChart>
                        </div>
                    </div>

                    {/* 과목별 출결 현황 (막대 그래프) */}
                    <div className="chart-container">
                        <h2>과목별 출결 현황</h2>
                        <div className="bar-chart-wrapper">
                            <BarChart
                                width={350}
                                height={250}
                                data={barData}
                                margin={{top: 20, right: 30, left: 20, bottom: 5}}
                            >
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="courseName"/>
                                <YAxis/>
                                <Tooltip formatter={(value) => `${value}회`}/> {/* 툴팁 포맷 수정 */}
                                <Legend/>
                                <Bar
                                    dataKey="attendance"
                                    name="출석"
                                    fill="#4CAF50"
                                    label={{position: 'top', formatter: (value) => `${value}회`}} // 바 위에 값 표시
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

                    </div>

                </div>
            </div>
        </div>
    );
};

export default AttendanceManagementPage;