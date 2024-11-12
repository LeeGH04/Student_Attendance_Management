import React from 'react';
import SideBar from './SideBar';
import styles from '../css/AdminMain.module.css';
import '../css/Base.css';

const AdminMain = () => {
    return (
        <div className="main-container">
            <SideBar />
            <div className="content-container">
                <div >
                    <h1 className="title">수업 현황</h1>
                </div>
                <div className={styles.statisticsContainer}>
                    <div className={styles.attendanceStatus}>
                        <h2>현재 출석 현황</h2>
                        {/*<div className={styles.barLineChart}></div>*/}
                    </div>
                    <div className={styles.totalAttendance}>
                        <h2>총 출석 현황</h2>
                        {/*<div className={styles.pieChart}></div>*/}
                    </div>
                    <div className={styles.notice}>
                        <h2>공지사항</h2>
                        {/*<div className={styles.noticeContent}></div>*/}
                    </div>
                </div>
                <div className={styles.timetable}>
                    <h2>시간표</h2>
                    <div className={styles.timetableContent}></div>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;