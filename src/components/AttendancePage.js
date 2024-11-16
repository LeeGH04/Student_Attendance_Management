// AttendancePage.js 수정
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/AttendancePage.module.css';
import '../css/Base.css';

const AttendancePage = () => {
    const [classes, setClasses] = useState([]);
    const [todayClasses, setTodayClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [attendanceCode, setAttendanceCode] = useState('');
    const [message, setMessage] = useState('');
    const studentId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/student/classes/${studentId}`);
                console.log('API Response:', response.data); // 디버깅용

                // 중복 제거
                const uniqueClasses = Array.from(new Set(response.data.map(c => c.class_id)))
                    .map(id => response.data.find(c => c.class_id === id));

                setClasses(uniqueClasses);

                // 오늘의 수업 필터링
                const days = ['일', '월', '화', '수', '목', '금', '토'];
                const today = days[new Date().getDay()];
                const todaySchedule = uniqueClasses.filter(class_ => class_.day_of_week === today)
                    .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

                setTodayClasses(todaySchedule);
            } catch (error) {
                console.error('수업 목록 조회 실패:', error);
            }
        };

        fetchClasses();
    }, [studentId]);

    const formatTime = (time) => {
        if (!time) return '';
        return time.slice(0, 5);
    };

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setMessage('');
    };

    const handleWeekChange = (e) => {
        setSelectedWeek(Number(e.target.value));
        setMessage('');
    };

    const handleCodeChange = (e) => {
        setAttendanceCode(e.target.value);
        setMessage('');
    };

    // AttendancePage.js - 출석 체크 부분 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClass) {
            setMessage('수업을 선택해주세요.');
            return;
        }
        if (!selectedWeek) {
            setMessage('주차를 선택해주세요.');
            return;
        }
        if (!attendanceCode) {
            setMessage('출석 코드를 입력해주세요.');
            return;
        }

        try {
            console.log('Sending attendance check:', {
                studentId,
                classId: selectedClass,
                week: selectedWeek,
                attendanceCode
            });

            const response = await axios.post('http://localhost:5002/api/attendance/check', {
                studentId,
                classId: selectedClass,
                week: selectedWeek,
                attendanceCode
            });

            console.log('Attendance check response:', response.data);

            if (response.data.success) {
                setMessage(`${response.data.className} - 출석이 완료되었습니다.`);
                setAttendanceCode('');
            }
        } catch (error) {
            console.error('Attendance check error:', error);
            setMessage(
                error.response?.data?.message ||
                '출석 처리 중 오류가 발생했습니다.'
            );
        }
    };

    return (
        <div className="main-container">
            <div className="content-container">
                <div className={styles.attendanceContainer}>
                    <div className={styles.leftSection}>
                        <h1 className="title">출석체크 페이지</h1>

                        <div className={styles.classSelection}>
                            <h2>수업 선택</h2>
                            <select
                                value={selectedClass}
                                onChange={handleClassChange}
                                className={styles.selectBox}
                            >
                                <option value="">수업을 선택하세요</option>
                                {classes.map((class_, index) => (
                                    <option
                                        key={`select-${class_.class_id}-${index}`}
                                        value={class_.class_id}
                                    >
                                        {class_.class_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.weekSelection}>
                            <h2>주차 선택</h2>
                            <select
                                value={selectedWeek}
                                onChange={handleWeekChange}
                                className={styles.selectBox}
                            >
                                {[...Array(15)].map((_, i) => (
                                    <option key={`week-${i + 1}`} value={i + 1}>
                                        {i + 1}주차
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.attendanceCode}>
                            <h2>출석 코드 입력</h2>
                            <input
                                type="text"
                                value={attendanceCode}
                                onChange={handleCodeChange}
                                placeholder="출석 코드를 입력하세요"
                                className={styles.attendanceInput}
                            />
                            <button onClick={handleSubmit}>출석 체크</button>
                            {message && (
                                <div className={styles.message}>{message}</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.todayTimetable}>
                            <h2>오늘의 시간표</h2>
                            {todayClasses.length > 0 ? (
                                <ul className={styles.timetableList}>
                                    {todayClasses.map((class_, index) => (
                                        <li
                                            key={`timetable-${class_.class_id}-${index}`}
                                            className={styles.timetableItem}
                                        >
                                            <p>
                                                {formatTime(class_.start_time)} - {formatTime(class_.end_time)}
                                                {class_.room_number && ` (${class_.room_number})`}
                                            </p>
                                            <span>{class_.class_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noClasses}>오늘은 수업이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;