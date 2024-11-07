import React, { useState } from 'react';
import '../css/AttendancePage.css'; // CSS 파일 임포트

const AttendancePage = () => {
    const [attendanceCode, setAttendanceCode] = useState('');

    const handleCodeChange = (e) => {
        setAttendanceCode(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 출석 코드 제출 시 처리 로직
        console.log('출석 코드:', attendanceCode);
    };

    return (
        <div className="attendance-container">
            <div className="left-section">
                <h1 className="attendance-title">출석체크 페이지</h1>

                <div className="current-class">
                    <h2>현재 수업</h2>
                    <div className="class-info-box">
                        {/* 현재 수업 표시 */}
                        <p>수업명: React 기초</p>
                    </div>
                </div>

                <div className="attendance-code">
                    <h2>출석 코드 입력</h2>
                    <input
                        type="text"
                        value={attendanceCode}
                        onChange={handleCodeChange}
                        placeholder="출석 코드를 입력하세요"
                        className="attendance-input"
                    />
                    <button onClick={handleSubmit}>출석 체크</button>
                </div>
            </div>

            <div className="right-section">
                <div className="today-timetable">
                    <h2>오늘의 시간표</h2>
                    <ul className="timetable-list">
                        <li className="timetable-item">
                            <p>10:00 - 11:00</p>
                            <span>React 기초</span>
                        </li>
                        <li className="timetable-item">
                            <p>11:30 - 12:30</p>
                            <span>JavaScript 심화</span>
                        </li>
                        <li className="timetable-item">
                            <p>13:00 - 14:00</p>
                            <span>웹 디자인</span>
                        </li>
                        <li className="timetable-item">
                            <p>14:30 - 15:30</p>
                            <span>UI/UX 디자인</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;