import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SideBar from './SideBar';
import styles from '../css/ParentMain.module.css';
import '../css/Base.css';

const ParentMain = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [timetableData, setTimetableData] = useState([]);
    const [todayStats, setTodayStats] = useState({ completed: 0, total: 0 });
    const [attendanceStats, setAttendanceStats] = useState({
        출석: 0,
        지각: 0,
        결석: 0
    });
    const [notifications, setNotifications] = useState([]);
    const parentId = sessionStorage.getItem('userId');

    // 자녀 목록 조회
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/parent/children/${parentId}`);
                setChildren(response.data);
                if (response.data.length > 0) {
                    setSelectedChild(response.data[0].id); // 첫 번째 자녀 자동 선택
                }
            } catch (error) {
                console.error('자녀 목록 조회 실패:', error);
            }
        };
        fetchChildren();
    }, [parentId]);

    // 선택된 자녀의 데이터 조회
    useEffect(() => {
        const fetchChildData = async () => {
            if (!selectedChild) return;

            try {
                // 시간표 데이터 가져오기
                const timetableResponse = await axios.get(`http://localhost:5002/api/timetable/${selectedChild}`);
                setTimetableData(timetableResponse.data);

                // 오늘의 출석 현황 계산
                const today = new Date();
                const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
                const currentHour = today.getHours();

                const todayClasses = timetableResponse.data.filter(class_ =>
                    class_.day_of_week === dayOfWeek
                );

                const completedClasses = todayClasses.filter(class_ => {
                    const classHour = parseInt(class_.start_time.split(':')[0]);
                    return classHour < currentHour;
                });

                setTodayStats({
                    completed: completedClasses.length,
                    total: todayClasses.length
                });

                // 전체 출석 통계 가져오기
                const attendanceResponse = await axios.get(
                    `http://localhost:5002/api/attendance/report/student/${selectedChild}`
                );

                if (attendanceResponse.data?.success && attendanceResponse.data?.data?.summary?.length > 0) {
                    const summary = attendanceResponse.data.data.summary[0];
                    setAttendanceStats({
                        출석: summary.attendance || 0,
                        지각: summary.tardiness || 0,
                        결석: summary.absence || 0
                    });
                }

                // 알림 데이터 가져오기
                const notificationResponse = await axios.get(`http://localhost:5002/api/notifications/${selectedChild}`);
                setNotifications(notificationResponse.data.slice(0, 5)); // 최근 5개 알림만
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            }
        };

        fetchChildData();
    }, [selectedChild]);

    const renderBarChart = () => {
        const data = [{
            name: '출결 현황',
            출석: attendanceStats.출석,
            지각: attendanceStats.지각,
            결석: attendanceStats.결석,
        }];

        const maxValue = Math.max(
            attendanceStats.출석,
            attendanceStats.지각,
            attendanceStats.결석
        );

        const ticks = Array.from(
            { length: Math.ceil(maxValue) },
            (_, i) => i + 1
        );

        return (
            <div className={styles.chartContainer}>
                <BarChart width={300} height={200} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis ticks={ticks} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="출석" fill="#4CAF50" />
                    <Bar dataKey="지각" fill="#FFC107" />
                    <Bar dataKey="결석" fill="#F44336" />
                </BarChart>
            </div>
        );
    };

    const renderTimetable = () => {
        const days = ['월', '화', '수', '목', '금'];
        const times = Array.from({ length: 8 }, (_, i) => i + 1);

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
                                    {lecture && (
                                        <div className={styles.class}>
                                            {lecture.class_name}
                                            <br />
                                            {lecture.room_number}
                                        </div>
                                    )}
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
                    <h1 className="title">자녀 출결 현황</h1>
                </div>

                <div className={styles.childSelector}>
                    <select
                        value={selectedChild || ''}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className={styles.selectBox}
                    >
                        <option value="">자녀 선택</option>
                        {children.map(child => (
                            <option key={child.id} value={child.id}>
                                {child.name} ({child.id})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedChild && (
                    <>
                        <div className={styles.statisticsContainer}>
                            <div className={styles.card}>
                                <h2>오늘의 출석 현황</h2>
                                <div className={styles.progressWrapper}>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${todayStats.total === 0 ? 0 : (todayStats.completed / todayStats.total) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <p className={styles.progressText}>
                                        {todayStats.completed}개 완료 / 총 {todayStats.total}개 수업
                                    </p>
                                </div>
                            </div>
                            <div className={styles.card}>
                                <h2>총 출석 현황</h2>
                                {renderBarChart()}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2>시간표</h2>
                            <div className={styles.timetableContent}>
                                {renderTimetable()}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2>최근 알림</h2>
                            <div className={styles.notificationList}>
                                {notifications.map(notification => (
                                    <div key={notification.notification_id} className={styles.notificationItem}>
                                        <h3>{notification.title}</h3>
                                        <p>{notification.content}</p>
                                        <span className={styles.date}>
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ParentMain;