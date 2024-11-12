import React, {useEffect, useState} from 'react';
import styles from '../css/AttendanceReportCreatePage.module.css';
import '../css/Base.css';

const AttendanceReportCreatePage = () => {
    const [reportData, setReportData] = useState({
        date: '2024-11-12',
        subject: '웹프로그래밍',
        classCode: '',//자동 생성되는 코드
        students: [
            {id: 20201234, name: '김철수', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20205678, name: '이영희', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20209012, name: '박민수', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20203456, name: '정지훈', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20207890, name: '최수진', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20202345, name: '강동원', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20206789, name: '윤서연', status: '출석', image: '/api/placeholder/120/150'},
            {id: 20201111, name: '한지민', status: '출석', image: '/api/placeholder/120/150'},
            ...Array(24).fill(null).map((_, index) => ({
                id: 20200001 + index,
                name: `학생${index + 9}`,
                status: '출석',
                image: '/api/placeholder/120/150'
            }))
        ]
    });
    useEffect(() => {
        const generateClassCode = () => {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setReportData(prev => ({
                ...prev,
                classCode: code
            }));
        };

        generateClassCode(); // 초기 코드 생성
        const interval = setInterval(generateClassCode, 300000); // 5분마다 갱신

        return () => clearInterval(interval);
    }, []);

    const [classCodeInput, setClassCodeInput] = useState('');

    const handleStatusChange = (studentId, newStatus) => {
        setReportData(prev => ({
            ...prev,
            students: prev.students.map(student =>
                student.id === studentId
                    ? {...student, status: newStatus}
                    : student
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('제출된 보고서:', reportData);
    };

    return (
        <div className="main-container">
            <div className="content-container">
                <h1 className="title">출석 보고서</h1>

                <div className={styles.content}>
                    {/* 헤더 섹션 */}
                    <div className={styles.headerSection}>
                        <div className={styles.formGroup}>
                            <label>날짜</label>
                            <input
                                type="date"
                                value={reportData.date}
                                onChange={e => setReportData({...reportData, date: e.target.value})}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>과목명</label>
                            <input
                                type="text"
                                value={reportData.subject}
                                onChange={e => setReportData({...reportData, subject: e.target.value})}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>수업 코드</label>
                            <div className={styles.codeDisplay}>
                                {reportData.classCode}
                            </div>
                        </div>
                    </div>

                    {/* 학생 그리드 */}
                    <div className={styles.studentGrid}>
                        {reportData.students.map(student => (
                            <div key={student.id} className={styles.studentCard}>
                                <img
                                    src={student.image}
                                    alt={student.name}
                                    className={styles.studentImage}
                                />
                                <div className={styles.studentInfo}>
                                    <div className={styles.studentId}>{student.id}</div>
                                    <div className={styles.studentName}>{student.name}</div>
                                </div>
                                <select
                                    value={student.status}
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

                    {/* 제출 버튼 */}
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