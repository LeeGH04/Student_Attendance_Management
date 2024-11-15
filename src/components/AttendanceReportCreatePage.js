import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../css/AttendanceReportCreatePage.module.css';
import '../css/Base.css';

const AttendanceReportCreatePage = () => {
    const [reportData, setReportData] = useState({
        class_id: '',
        week: 1,
        classCode: '',
        students: []
    });

    // 상태값 매핑 객체 추가
    const statusMap = {
        '출석': 'present',
        '지각': 'late',
        '결석': 'absent',
        '조퇴': 'early_leave'
    };

    const reverseStatusMap = {
        'present': '출석',
        'late': '지각',
        'absent': '결석',
        'early_leave': '조퇴'
    };
    const [classes, setClasses] = useState([]);
    const professorId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/professor/classes/${professorId}`);
                setClasses(response.data);
            } catch (error) {
                console.error('수업 목록 조회 실패:', error);
            }
        };
        fetchClasses();
    }, [professorId]);
// AttendanceReportCreatePage.js에 추가
    useEffect(() => {
        const fetchExistingAttendance = async () => {
            if (!reportData.class_id || !reportData.week) return;

            try {
                const response = await axios.get(
                    `http://localhost:5002/api/attendance/report/${reportData.class_id}/${reportData.week}`
                );
                if (response.data.length > 0) {
                    setReportData(prev => ({
                        ...prev,
                        students: prev.students.map(student => {
                            const existingRecord = response.data.find(
                                record => record.student_id === student.id
                            );
                            return {
                                ...student,
                                status: existingRecord ? existingRecord.attendance_status : '출석'
                            };
                        })
                    }));
                }
            } catch (error) {
                console.error('기존 출석 기록 조회 실패:', error);
            }
        };

        fetchExistingAttendance();
    }, [reportData.class_id, reportData.week]);
    useEffect(() => {
        const fetchStudents = async () => {
            if (!reportData.class_id) return;

            try {
                const response = await axios.get(`http://localhost:5002/api/class/students/${reportData.class_id}`);
                setReportData(prev => ({
                    ...prev,
                    students: response.data.map(student => ({
                        ...student,
                        status: 'present'  // 기본값을 영문으로 변경
                    }))
                }));
            } catch (error) {
                console.error('학생 목록 조회 실패:', error);
            }
        };
        fetchStudents();
    }, [reportData.class_id]);

    useEffect(() => {
        const generateClassCode = () => {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setReportData(prev => ({...prev, classCode: code}));
        };

        generateClassCode();
        const interval = setInterval(generateClassCode, 300000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusChange = (studentId, newStatus) => {
        setReportData(prev => ({
            ...prev,
            students: prev.students.map(student =>
                student.id === studentId ? {...student, status: statusMap[newStatus]} : student
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('전송할 데이터:', reportData);  // 전송 데이터 확인

            const response = await axios.post('http://localhost:5002/api/attendance/report', reportData);
            console.log('서버 응답:', response.data);  // 서버 응답 확인

            alert('출석부가 저장되었습니다.');
        } catch (error) {
            console.error('출석부 저장 실패:', error);
            console.error('에러 응답:', error.response?.data);  // 서버에서 보낸 에러 메시지 확인

            alert(error.response?.data?.message || '출석부 저장에 실패했습니다.');
        }
    };

    return (
        <div className="main-container">
            <div className="content-container">
                <h1 className="title">출석 보고서</h1>

                <div className={styles.content}>
                    <div className={styles.headerSection}>
                        <div className={styles.formGroup}>
                            <label>수업 주차</label>
                            <select
                                value={reportData.week}
                                onChange={e => setReportData({...reportData, week: Number(e.target.value)})}
                                required
                            >
                                {[...Array(15)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}주차
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>과목명</label>
                            <select
                                value={reportData.class_id}
                                onChange={e => setReportData({...reportData, class_id: e.target.value})}
                                required
                            >
                                <option value="">과목을 선택하세요</option>
                                {classes.map(cls => (
                                    <option key={cls.class_id} value={cls.class_id}>
                                        {cls.class_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>수업 코드</label>
                            <div className={styles.codeDisplay}>
                                {reportData.classCode}
                            </div>
                        </div>
                    </div>

                    <div className={styles.studentGrid}>
                        {reportData.students.map(student => (
                            <div key={student.id} className={styles.studentCard}>
                                <img
                                    src={student.image_url || '/api/placeholder/120/150'}
                                    alt={student.name}
                                    className={styles.studentImage}
                                />
                                <div className={styles.studentInfo}>
                                    <div className={styles.studentId}>{student.id}</div>
                                    <div className={styles.studentName}>{student.name}</div>
                                </div>
                                <select
                                    value={reverseStatusMap[student.status]}  // 표시할 때는 한글로 변환
                                    onChange={e => handleStatusChange(student.id, e.target.value)}
                                    className={styles.statusSelect}
                                >
                                    <option value="출석">출석</option>
                                    <option value="지각">지각</option>
                                    <option value="결석">결석</option>
                                    <option value="조퇴">조퇴</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className={styles.submitSection}>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={styles.submitBtn}
                        >
                            출석부 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendanceReportCreatePage;