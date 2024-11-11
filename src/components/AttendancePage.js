import React, { useState } from 'react';
import '../css/AttendancePage.css'; // CSS 파일 임포트
import '../css/Base.css';


//

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
        <div className="main-container">
            <div className="content-container">
                <div className="attendance-container">
                    <div className="left-section">
                        <h1 className="title">출석체크 페이지</h1>

                        <div className="current-class">
                            <h1>현재 수업</h1>
                            <div className="class-info-box">
                                {/* 현재 수업 표시 */}
                                <p>수업명: React 기초</p>
                            </div>
                        </div>
                        <div className="box"></div>

                        <div className="attendance-code">
                            <h1>출석 코드 입력</h1>
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
                            <h1>오늘의 시간표</h1>
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
            </div>
        </div>
            );
            };

            export default AttendancePage;