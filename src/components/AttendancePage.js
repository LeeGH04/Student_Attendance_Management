import React, { useState } from 'react';
import styles from '../css/AttendancePage.module.css';
import '../css/Base.css';

const AttendancePage = () => {
    const [attendanceCode, setAttendanceCode] = useState('');

    const handleCodeChange = (e) => {
        setAttendanceCode(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('출석 코드:', attendanceCode);
    };

    return (
        <div className="main-container">
            <div className="content-container">
                <div className={styles.attendanceContainer}>
                    <div className={styles.leftSection}>
                        <h1 className="title">출석체크 페이지</h1>

                        <div className={styles.currentClass}>
                            <h1>현재 수업</h1>
                            <div className={styles.classInfoBox}>
                                <p>수업명: React 기초</p>
                            </div>
                        </div>
                        <div className={styles.box}></div>

                        <div className={styles.attendanceCode}>
                            <h1>출석 코드 입력</h1>
                            <input
                                type="text"
                                value={attendanceCode}
                                onChange={handleCodeChange}
                                placeholder="출석 코드를 입력하세요"
                                className={styles.attendanceInput}
                            />
                            <button onClick={handleSubmit}>출석 체크</button>
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.todayTimetable}>
                            <h1>오늘의 시간표</h1>
                            <ul className={styles.timetableList}>
                                <li className={styles.timetableItem}>
                                    <p>10:00 - 11:00</p>
                                    <span>React 기초</span>
                                </li>
                                <li className={styles.timetableItem}>
                                    <p>11:30 - 12:30</p>
                                    <span>JavaScript 심화</span>
                                </li>
                                <li className={styles.timetableItem}>
                                    <p>13:00 - 14:00</p>
                                    <span>웹 디자인</span>
                                </li>
                                <li className={styles.timetableItem}>
                                    <p>14:30 - 15:30</p>
                                    <span>UI/UX 디자인</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;