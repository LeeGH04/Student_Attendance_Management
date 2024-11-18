import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import styles from '../css/ProfessorMain.module.css';
import '../css/Base.css';
import SideBar from './SideBar';

const ProfessorMain = () => {
    const [timetableData, setTimetableData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 시간표 데이터 가져오기
                const timetableResponse = await axios.get(`http://localhost:5002/api/timetable/professor/${userId}`);
                setTimetableData(timetableResponse.data);

                // 알림 데이터 가져오기
                const notificationResponse = await axios.get(`http://localhost:5002/api/notifications/${userId}`);
                setNotifications(notificationResponse.data.filter(notif => !notif.is_read));

                // 공지사항 데이터 가져오기
                const announcementResponse = await axios.get('http://localhost:5002/api/announcements');
                setAnnouncements(announcementResponse.data.slice(0, 5)); // 최근 5개만
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            }
        };


        fetchData();
    }, [userId]);


    const renderTimetable = () => {
        const days = ['월', '화', '수', '목', '금'];
        const times = Array.from({length: 8}, (_, i) => i + 1);

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
                                parseInt(class_.start_time?.split(':')[0]) === time + 8
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
                    <h1 className="title">수업 현황</h1>
                </div>

                <div className={styles.topSection}>
                    <div className={styles.notifications}>
                        <div className={styles.sectionHeader}>
                            <h2>새로운 알림</h2>
                            <div className={styles.notificationBadge}>
                                <Bell />
                                {notifications.length > 0 && (
                                    <span className={styles.badge}>{notifications.length}</span>
                                )}
                            </div>
                        </div>
                        <div className={styles.notificationList}>
                            {notifications.slice(0, 3).map(notification => (
                                <div key={notification.notification_id} className={styles.notificationItem}>
                                    <h3>{notification.title}</h3>
                                    <p>{notification.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.announcements}>
                        <h2>공지사항</h2>
                        <div className={styles.announcementList}>
                            {announcements.slice(0, 3).map(announcement => (
                                <div key={announcement.id} className={styles.announcementItem}>
                                    <h3>{announcement.title}</h3>
                                    <p className={styles.date}>
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
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

export default ProfessorMain;