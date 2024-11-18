import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import SideBar from './SideBar';
import styles from '../css/AdminMain.module.css';
import '../css/Base.css';

const AdminMain = () => {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, announceRes] = await Promise.all([
                    axios.get(`http://localhost:5002/api/notifications/${userId}`),
                    axios.get('http://localhost:5002/api/announcements')
                ]);

                setNotifications(notifRes.data.filter(n => !n.is_read).slice(0, 3));
                setAnnouncements(announceRes.data.slice(0, 3));
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            }
        };

        fetchData();
    }, [userId]);

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
                            {notifications.map(notification => (
                                <div key={notification.notification_id} className={styles.notificationItem}>
                                    <h3>{notification.title}</h3>
                                    <p>{notification.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.announcements}>
                        <h2>새로운 공지사항</h2>
                        <div className={styles.announcementList}>
                            {announcements.map(announcement => (
                                <div key={announcement.announcement_id} className={styles.announcementItem}>
                                    <h3>{announcement.title}</h3>
                                    <p className={styles.date}>
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;