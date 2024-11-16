require('dotenv').config(); // .env 파일 사용
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // JWT 사용
const app = express();
const port = process.env.PORT || 5002;

// CORS 설정
app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 연결 풀 설정
//민수형
// const dbPool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'jj021204!@',
//     database: process.env.DB_NAME || 'eundata',
// });

//은솔
// const dbPool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '8421choi@',
//     database: process.env.DB_NAME || 'projsystem',
// });

//건휘
const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'LeeGH04',
    password: process.env.DB_PASSWORD || '0004',
    database: process.env.DB_NAME || 'Attendance',
});

// 로그인 라우트 (학번으로 로그인)
app.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        const [rows] = await dbPool.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        const user = rows[0];

        if (password === user.password) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({
                success: true,
                message: '로그인 성공!',
                token,
                role: user.role,
                userId: user.id  // id 추가
            });
        } else {
            res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(403).json({ success: false, message: '토큰이 없습니다.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });

        req.user = user;
        next();
    });
};

app.get('/user/profile', authenticateToken, async (req, res) => {
    const { id } = req.user;

    try {
        const [rows] = await dbPool.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
        }

        const user = rows[0];

        res.json({
            name: user.name,
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
        });
    } catch (error) {
        console.error('사용자 정보 가져오기 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '사용자 정보를 가져오는 중 오류가 발생했습니다.' });
    }
});
app.get('/api/attendance/report/student/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    console.log("Request received for studentId:", studentId);

    // 먼저 간단한 응답 테스트
    try {
        // 1. 기본 쿼리 테스트
        const [testData] = await dbPool.query(
            'SELECT * FROM ClassWeekly_Students WHERE student_id = ?',
            [studentId]
        );
        console.log("Test data:", testData);

        // 2. 실제 상세 데이터 쿼리
        const [details] = await dbPool.query(`
            SELECT 
                c.class_name as courseName,
                cws.student_id as studentId,
                cws.week,
                cws.attendance_status,
                u.name as studentName
            FROM ClassWeekly_Students cws
            JOIN Classes c ON cws.class_id = c.class_id
            JOIN users u ON u.id = cws.student_id
            WHERE cws.student_id = ?`,
            [studentId]
        );
        console.log("Detail data:", details);

        // 3. 통계 데이터 쿼리
        const [summary] = await dbPool.query(`
            SELECT 
                c.class_name as courseName,
                SUM(case when attendance_status = 'present' then 1 else 0 end) as attendance,
                SUM(case when attendance_status = 'late' then 1 else 0 end) as tardiness,
                SUM(case when attendance_status = 'absent' then 1 else 0 end) as absence
            FROM ClassWeekly_Students cws
            JOIN Classes c ON cws.class_id = c.class_id
            WHERE student_id = ?
            GROUP BY c.class_name`,
            [studentId]
        );
        console.log("Summary data:", summary);

        // 4. 최종 응답 객체 생성
        const response = {
            success: true,
            data: {
                details: details,
                summary: summary
            }
        };
        console.log("Sending response:", response);

        // 5. 응답 전송
        res.json(response);

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: [],
            summary: []
        });
    }
});
// 사용자 정보 업데이트 API 추가
app.post('/updateUserData', authenticateToken, async (req, res) => {
    const { email, phone_number, password } = req.body;
    const { id } = req.user;

    try {
        // SQL 쿼리로 사용자 정보 업데이트
        const [result] = await dbPool.execute(
            'UPDATE users SET email = ?, phone_number = ?, password = ? WHERE id = ?',
            [email, phone_number, password, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
        }

        res.json({ success: true, message: '정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('업데이트 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '정보를 업데이트하는 중 오류가 발생했습니다.' });
    }
});

// newServer.js에 추가할 API:
app.get('/api/timetable/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const query = `
           SELECT t.*, c.class_name
           FROM Timetable t
           JOIN Classes c ON t.class_id = c.class_id
           JOIN Class_Students cs ON c.class_id = cs.class_id
           WHERE cs.student_id = ?
           ORDER BY t.day_of_week, t.start_time
       `;

        const [rows] = await dbPool.query(query, [studentId]);
        res.json(rows);
    } catch (error) {
        console.error('시간표 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '시간표를 불러오는데 실패했습니다.'
        });
    }
});

// 교수의 수업 목록 조회
app.get('/api/professor/classes/:professorId', async (req, res) => {
    const { professorId } = req.params;
    try {
        const [rows] = await dbPool.query(
            'SELECT * FROM Classes WHERE professor_id = ?',
            [professorId]
        );
        res.json(rows);
    } catch (error) {
        console.error('수업 목록 조회 오류:', error);
        res.status(500).json({ message: '수업 목록 조회 실패' });
    }
});

// 수업의 학생 목록 조회
app.get('/api/class/students/:classId', async (req, res) => {
    const { classId } = req.params;
    try {
        const [rows] = await dbPool.query(
            `SELECT u.* FROM users u 
            JOIN Class_Students cs ON u.id = cs.student_id 
            WHERE cs.class_id = ?`,
            [classId]
        );
        res.json(rows);
    } catch (error) {
        console.error('학생 목록 조회 오류:', error);
        res.status(500).json({ message: '학생 목록 조회 실패' });
    }
});

// 출석 보고서 저장
app.post('/api/attendance/report', async (req, res) => {
    const { class_id, week, students, classCode } = req.body;

    try {
        // 1. 기존 출석 기록 삭제
        await dbPool.query(
            `DELETE FROM ClassWeekly_Students 
             WHERE class_id = ? AND week = ?`,
            [class_id, week]
        );

        // 2. 코드가 있는 경우 처리
        if (classCode) {
            // 기존 활성 코드 비활성화
            await dbPool.query(
                `UPDATE Class_Codes 
                 SET is_active = FALSE 
                 WHERE class_id = ?`,
                [class_id]
            );

            // 새 코드 생성
            await dbPool.query(
                `INSERT INTO Class_Codes 
                 (class_id, week, attendance_code, expired_at) 
                 VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
                [class_id, week, classCode]
            );
        }

        // 3. 새로운 출석 기록 저장
        for (const student of students) {
            await dbPool.query(
                `INSERT INTO ClassWeekly_Students 
                 (class_id, week, student_id, attendance_status) 
                 VALUES (?, ?, ?, ?)`,
                [class_id, week, student.id, student.status]
            );
        }

        res.json({ message: '출석부 저장 성공' });
    } catch (error) {
        console.error('출석부 저장 오류:', error);
        res.status(500).json({
            message: '출석부 저장 실패',
            error: error.message,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
    }
});

// 주차별 출석 현황 조회 API 추가
app.get('/api/attendance/report/:classId/:week', async (req, res) => {
    const { classId, week } = req.params;

    try {
        const [rows] = await dbPool.query(
            `SELECT cws.*, u.name 
             FROM ClassWeekly_Students cws
             JOIN users u ON cws.student_id = u.id
             WHERE cws.class_id = ? AND cws.week = ?`,
            [classId, week]
        );
        res.json(rows);
    } catch (error) {
        console.error('출석 현황 조회 오류:', error);
        res.status(500).json({ message: '출석 현황 조회 실패' });
    }
});
// 주차별 출석 현황 조회 API 추가
app.get('/api/attendance/report/:classId/:week', async (req, res) => {
    const { classId, week } = req.params;

    try {
        const [rows] = await dbPool.query(
            `SELECT cws.*, u.name 
             FROM ClassWeekly_Students cws
             JOIN users u ON cws.student_id = u.id
             WHERE cws.class_id = ? AND cws.week = ?`,
            [classId, week]
        );
        res.json(rows);
    } catch (error) {
        console.error('출석 현황 조회 오류:', error);
        res.status(500).json({ message: '출석 현황 조회 실패' });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});