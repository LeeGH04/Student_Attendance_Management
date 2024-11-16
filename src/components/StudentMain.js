import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import styles from '../css/StudentMain.module.css';
import '../css/Base.css';

const StudentMain = () => {
    const [timetableData, setTimetableData] = useState([]);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/timetable/${userId}`);
                setTimetableData(response.data);
            } catch (error) {
                console.error('시간표 조회 실패:', error);
            }
        };

        fetchTimetable();
    }, [userId]);

    const renderTimetable = () => {
        const days = ['월', '화', '수', '목', '금'];
        const times = Array.from({length: 8}, (_, i) => i + 1);  // 1교시~8교시

        return (
            <table className={styles.timetableGrid}>
                <thead>
                <tr>
                    <th></th>
                    {days.map(day => <th key={day}>{day}</th>)}
                </tr>
                </thead>
                <tbody>
                {times.map(time => (
                    <tr key={time}>
                        <td>{time}교시</td>
                        {days.map(day => {
                            const lecture = timetableData.find(class_ =>
                                class_.day_of_week === day &&
                                parseInt(class_.start_time.split(':')[0]) === time + 8
                            );
                            return (
                                <td key={day}>
                                    {lecture ? (
                                        <div className={styles.class}>
                                            {lecture.class_name}
                                            <br />
                                            {lecture.room_number}
                                        </div>
                                    ) : null}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="main-container">
            <SideBar />
            <div className="content-container">
                <div className={styles.header}>
                    <h1 className="title">수업 현황</h1>
                </div>
                <div className={styles.statisticsContainer}>
                    <div className={styles.attendanceStatus}>
                        <h2>현재 출석 현황</h2>
                        <div className={styles.barLineChart}></div>
                    </div>
                    <div className={styles.totalAttendance}>
                        <h2>총 출석 현황</h2>
                        <div className={styles.pieChart}></div>
                    </div>
                    <div className={styles.notice}>
                        <h2>공지사항</h2>
                        <div className={styles.noticeContent}></div>
                    </div>
                </div>
                <div className={styles.timetable}>
                    <h2>시간표</h2>
                    <div className={styles.timetableContent}>
                        {renderTimetable()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentMain;