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


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(403).json({ success: false, message: '토큰이 없습니다.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: '유효하지 않은 토큰입니다.' });

        req.user = user;
        next();
    });
};
// =============== 인증 관련 API ===============
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

// =============== 사용자 관리 API ===============

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

// 사용자 검색 API
app.get('/api/users/search', async (req, res) => {
    const { query } = req.query;

    try {
        const [users] = await dbPool.query(
            `SELECT id, name, role 
             FROM users 
             WHERE name LIKE ? OR id LIKE ?
             LIMIT 10`,
            [`%${query}%`, `%${query}%`]
        );

        res.json(users);
    } catch (error) {
        console.error('사용자 검색 오류:', error);
        res.status(500).json({ message: '사용자 검색에 실패했습니다.' });
    }
});

// 사용자 목록 조회
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM users ORDER BY id');
        res.json(rows);
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({ message: '사용자 목록 조회에 실패했습니다.' });
    }
});

// 사용자 정보 업데이트
app.put('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, email, phone_number, role } = req.body;

    try {
        await dbPool.query(
            'UPDATE users SET name = ?, email = ?, phone_number = ?, role = ? WHERE id = ?',
            [name, email, phone_number, role, userId]
        );
        res.json({ message: '사용자 정보가 업데이트되었습니다.' });
    } catch (error) {
        console.error('사용자 업데이트 오류:', error);
        res.status(500).json({ message: '사용자 정보 업데이트에 실패했습니다.' });
    }
});

// 사용자 삭제
app.delete('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await dbPool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: '사용자가 삭제되었습니다.' });
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ message: '사용자 삭제에 실패했습니다.' });
    }
});


// =============== 공지사항 관리 API ===============
/**
 * @route   GET /api/announcements
 * @desc    공지사항 목록 조회
 * @access  Private
 * @return  {Array} 공지사항 목록
 */
app.get('/api/announcements', async (req, res) => {
    try {
        const [rows] = await dbPool.query(`
            SELECT 
                a.announcement_id,
                a.title,
                a.content,
                a.created_at,
                a.updated_at,
                u.name as author_name,
                u.id as author_id
            FROM Announcements a
            JOIN users u ON a.author_id = u.id
            ORDER BY a.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('공지사항 조회 오류:', error);
        res.status(500).json({ message: '공지사항 목록을 불러오는데 실패했습니다.' });
    }
});

/**
 * @route   POST /api/announcements
 * @desc    공지사항 작성
 * @access  Private (Admin/Professor)
 * @param   {
 *   title: string,
 *   content: string
 * }
 */
app.post('/api/announcements', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const author_id = req.user.id;

    try {
        const [result] = await dbPool.query(
            'INSERT INTO Announcements (title, content, author_id) VALUES (?, ?, ?)',
            [title, content, author_id]
        );

        const [newAnnouncement] = await dbPool.query(`
            SELECT 
                a.announcement_id,
                a.title,
                a.content,
                a.created_at,
                u.name as author_name
            FROM Announcements a
            JOIN users u ON a.author_id = u.id
            WHERE a.announcement_id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: '공지사항이 등록되었습니다.',
            announcement: newAnnouncement[0]
        });
    } catch (error) {
        console.error('공지사항 등록 오류:', error);
        res.status(500).json({ success: false, message: '공지사항 등록에 실패했습니다.' });
    }
});

/**
 * @route   PUT /api/announcements/:id
 * @desc    공지사항 수정
 * @access  Private (Admin/Professor)
 */
app.put('/api/announcements/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const author_id = req.user.id;

    try {
        const [announcement] = await dbPool.query(
            'SELECT author_id FROM Announcements WHERE announcement_id = ?',
            [id]
        );

        if (!announcement.length) {
            return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
        }

        if (announcement[0].author_id !== author_id) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }

        await dbPool.query(
            'UPDATE Announcements SET title = ?, content = ? WHERE announcement_id = ?',
            [title, content, id]
        );

        res.json({ message: '공지사항이 수정되었습니다.' });
    } catch (error) {
        console.error('공지사항 수정 오류:', error);
        res.status(500).json({ message: '공지사항 수정에 실패했습니다.' });
    }
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    공지사항 삭제
 * @access  Private (Admin/Professor)
 */
app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const author_id = req.user.id;

    try {
        const [announcement] = await dbPool.query(
            'SELECT author_id FROM Announcements WHERE announcement_id = ?',
            [id]
        );

        if (!announcement.length) {
            return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
        }

        if (announcement[0].author_id !== author_id) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }

        await dbPool.query('DELETE FROM Announcements WHERE announcement_id = ?', [id]);
        res.json({ message: '공지사항이 삭제되었습니다.' });
    } catch (error) {
        console.error('공지사항 삭제 오류:', error);
        res.status(500).json({ message: '공지사항 삭제에 실패했습니다.' });
    }
});

/**
 * @route   GET /api/announcements/search
 * @desc    공지사항 검색
 * @access  Private
 * @query   {
 *   type: 'title' | 'content' | 'author',
 *   query: string
 * }
 */
app.get('/api/announcements/search', async (req, res) => {
    const { type, query } = req.query;
    let sql = '';

    try {
        switch(type) {
            case 'title':
                sql = `
                    SELECT a.*, u.name as author_name 
                    FROM Announcements a 
                    JOIN users u ON a.author_id = u.id 
                    WHERE a.title LIKE ?
                `;
                break;
            case 'content':
                sql = `
                    SELECT a.*, u.name as author_name 
                    FROM Announcements a 
                    JOIN users u ON a.author_id = u.id 
                    WHERE a.content LIKE ?
                `;
                break;
            case 'author':
                sql = `
                    SELECT a.*, u.name as author_name 
                    FROM Announcements a 
                    JOIN users u ON a.author_id = u.id 
                    WHERE u.name LIKE ?
                `;
                break;
            default:
                return res.status(400).json({ message: '잘못된 검색 유형입니다.' });
        }

        const [rows] = await dbPool.query(sql, [`%${query}%`]);
        res.json(rows);
    } catch (error) {
        console.error('공지사항 검색 오류:', error);
        res.status(500).json({ message: '공지사항 검색에 실패했습니다.' });
    }
});


// =============== 출석 관리 API ===============


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
// 출석 보고서 저장
/**
 * @route   POST /api/attendance/report
 * @desc    출석 보고서 저장 및 결석 알림 처리
 * @access  Private (Professor)
 */
app.post('/api/attendance/report', async (req, res) => {
    const { class_id, week, students, classCode } = req.body;
    const connection = await dbPool.getConnection();

    try {
        // 해당 수업의 교수 ID 가져오기
        const [classInfo] = await connection.query(
            'SELECT professor_id, class_name FROM Classes WHERE class_id = ?',
            [class_id]
        );

        if (!classInfo.length) {
            throw new Error('수업 정보를 찾을 수 없습니다.');
        }

        const professor_id = classInfo[0].professor_id;
        await connection.beginTransaction();

        // 1. 해당 주차의 출석 기록 삭제
        await connection.query(
            `DELETE FROM ClassWeekly_Students
             WHERE class_id = ? AND week = ?`,
            [class_id, week]
        );

        // 2. 출석 코드 처리
        if (classCode) {
            await connection.query(
                `UPDATE Class_Codes
                 SET is_active = FALSE
                 WHERE class_id = ? AND week = ?`,
                [class_id, week]
            );

            await connection.query(
                `INSERT INTO Class_Codes
                 (class_id, week, attendance_code, expired_at)
                 VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))`,
                [class_id, week, classCode]
            );
        }

        // 3. 새로운 출석 기록 저장 및 결석 확인
        for (const studentData of students) {
            // 3.1 출석 상태 저장
            await connection.query(
                `INSERT INTO ClassWeekly_Students
                 (class_id, week, student_id, attendance_status)
                 VALUES (?, ?, ?, ?)`,
                [class_id, week, studentData.id, studentData.status]
            );

            // 3.2 결석인 경우, 누적 결석 횟수 확인
            if (studentData.status === 'absent') {
                const [absences] = await connection.query(`
                    SELECT COUNT(*) as absent_count
                    FROM ClassWeekly_Students
                    WHERE class_id = ? 
                    AND student_id = ?
                    AND attendance_status = 'absent'`,
                    [class_id, studentData.id]
                );

                // 3.3 결석이 3번 이상인 경우 알림 발송
                if (absences[0].absent_count >= 3) {
                    // 학생 정보 조회
                    const [studentInfo] = await connection.query(
                        'SELECT name FROM users WHERE id = ?',
                        [studentData.id]
                    );

                    // 학생에게 알림 발송
                    await connection.query(`
                        INSERT INTO Notifications 
                        (sender_id, receiver_id, title, content)
                        VALUES (?, ?, ?, ?)`,
                        [
                            professor_id,
                            studentData.id,
                            '출석 경고',
                            `${classInfo[0].class_name} 수업에서 결석이 3회 이상 누적되었습니다. 출석 관리에 유의해주세요.`
                        ]
                    );

                    // 학부모 정보 조회 및 알림 발송
                    const [parentInfo] = await connection.query(`
                        SELECT p.id as parent_id
                        FROM ParentChild pc
                        JOIN users p ON pc.parent_id = p.id
                        WHERE pc.student_id = ?`,
                        [studentData.id]
                    );

                    if (parentInfo.length > 0) {
                        await connection.query(`
                            INSERT INTO Notifications 
                            (sender_id, receiver_id, title, content)
                            VALUES (?, ?, ?, ?)`,
                            [
                                professor_id,
                                parentInfo[0].parent_id,
                                '자녀 출석 경고',
                                `자녀(${studentInfo[0].name})의 ${classInfo[0].class_name} 수업 결석이 3회 이상 누적되었습니다.`
                            ]
                        );
                    }
                }
            }
        }

        await connection.commit();
        res.json({
            success: true,
            message: '출석부가 저장되었습니다.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('출석부 저장 오류:', error);
        res.status(500).json({
            success: false,
            message: '출석부 저장 실패',
            error: error.message,
            stack: error.stack
        });
    } finally {
        connection.release();
    }
});

app.get('/api/attendance/absence-count/:studentId/:classId', async (req, res) => {
    const { studentId, classId } = req.params;

    try {
        const [absences] = await dbPool.query(`
            SELECT 
                c.class_name,
                COUNT(*) as absent_count
            FROM ClassWeekly_Students cws
            JOIN Classes c ON c.class_id = cws.class_id
            WHERE cws.student_id = ? 
            AND cws.class_id = ?
            AND cws.attendance_status = 'absent'
            GROUP BY cws.class_id`,
            [studentId, classId]
        );

        res.json({
            success: true,
            data: absences[0] || { class_name: '', absent_count: 0 }
        });
    } catch (error) {
        console.error('결석 횟수 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '결석 횟수 조회에 실패했습니다.'
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
// newServer.js에 추가해야 할 API

// 학생의 전체 출석 통계를 가져오는 API
app.get('/api/attendance/summary/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const [results] = await dbPool.query(`
            SELECT 
                SUM(CASE WHEN attendance_status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN attendance_status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN attendance_status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN attendance_status = 'early_leave' THEN 1 ELSE 0 END) as early_leave
            FROM ClassWeekly_Students
            WHERE student_id = ?
        `, [studentId]);

        res.json(results[0]);
    } catch (error) {
        console.error('출석 통계 조회 실패:', error);
        res.status(500).json({ message: '출석 통계 조회에 실패했습니다.' });
    }
});
// newServer.js에 추가
// newServer.js - API 수정
app.post('/api/attendance/check', async (req, res) => {
    const { studentId, classId, week, attendanceCode } = req.body;
    console.log('Received attendance check request:', { studentId, classId, week, attendanceCode });

    try {
        // 1. 유효한 출석 코드인지 확인
        const [codeCheck] = await dbPool.query(
            `SELECT cc.*, c.class_name
             FROM Class_Codes cc
                      JOIN Classes c ON cc.class_id = c.class_id
             WHERE cc.class_id = ?
               AND cc.week = ?
               AND cc.attendance_code = ?
               AND cc.is_active = TRUE
               AND cc.expired_at > NOW()`,
            [classId, week, attendanceCode]
        );
        console.log('Code check result:', codeCheck);

        if (codeCheck.length === 0) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 출석 코드입니다.'
            });
        }

        // 2. 학생이 해당 수업을 수강하는지 확인
        const [studentCheck] = await dbPool.query(
            `SELECT * FROM Class_Students
             WHERE class_id = ? AND student_id = ?`,
            [classId, studentId]
        );
        console.log('Student check result:', studentCheck);

        if (studentCheck.length === 0) {
            return res.status(403).json({
                success: false,
                message: '이 수업을 수강하지 않는 학생입니다.'
            });
        }

        // 3. 이미 출석했는지 확인
        const [attendanceCheck] = await dbPool.query(
            `SELECT * FROM ClassWeekly_Students 
             WHERE class_id = ? AND student_id = ? AND week = ?`,
            [classId, studentId, week]
        );
        console.log('Attendance check result:', attendanceCheck);

        if (attendanceCheck.length > 0) {
            return res.status(400).json({
                success: false,
                message: '이미 출석 처리되었습니다.'
            });
        }

        // 4. 출석 처리
        await dbPool.query(
            `INSERT INTO ClassWeekly_Students 
             (class_id, student_id, week, attendance_status) 
             VALUES (?, ?, ?, 'present')`,
            [classId, studentId, week]
        );

        console.log('Attendance recorded successfully');

        res.json({
            success: true,
            message: '출석이 완료되었습니다.',
            className: codeCheck[0].class_name
        });

    } catch (error) {
        console.error('Error in attendance check:', error);
        res.status(500).json({
            success: false,
            message: '출석 처리 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});

// newServer.js에 새로운 API 추가
// 출석 코드 생성 API
app.post('/api/attendance/generate-code', async (req, res) => {
    const { class_id, week } = req.body;

    try {
        // 기존 활성 코드 비활성화
        await dbPool.query(
            `UPDATE Class_Codes
             SET is_active = FALSE
             WHERE class_id = ? AND week = ?`,
            [class_id, week]
        );

        // 새 코드 생성
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const [result] = await dbPool.query(
            `INSERT INTO Class_Codes
                 (class_id, week, attendance_code, expired_at, is_active)
             VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), TRUE)`,
            [class_id, week, newCode]
        );

        res.json({
            success: true,
            code: newCode,
            message: '출석 코드가 생성되었습니다.'
        });

    } catch (error) {
        console.error('출석 코드 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '출석 코드 생성 중 오류가 발생했습니다.'
        });
    }
});


// 학생의 수강 중인 수업 목록 조회
// newServer.js에서 수정
// newServer.js에서 수정
app.get('/api/student/classes/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const query = `
            SELECT DISTINCT
                c.class_id,
                c.class_name,
                t.start_time,
                t.end_time,
                t.day_of_week,
                t.room_number
            FROM Classes c
                     JOIN Class_Students cs ON c.class_id = cs.class_id
                     LEFT JOIN Timetable t ON c.class_id = t.class_id
            WHERE cs.student_id = ?
            ORDER BY t.day_of_week, t.start_time;
        `;

        const [rows] = await dbPool.query(query, [studentId]);
        console.log('Fetched classes:', rows);  // 디버깅용
        res.json(rows);
    } catch (error) {
        console.error('수업 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '수업 목록을 불러오는데 실패했습니다.'
        });
    }
});





// =============== 수업 관리 API ===============

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

/**
 * @route   GET /api/timetable/professor/:professorId
 * @desc    교수의 시간표 조회
 */
app.get('/api/timetable/professor/:professorId', async (req, res) => {
    const { professorId } = req.params;

    try {
        const query = `
            SELECT t.*, c.class_name
            FROM Timetable t
            JOIN Classes c ON t.class_id = c.class_id
            WHERE c.professor_id = ?
            ORDER BY t.day_of_week, t.start_time
        `;

        const [rows] = await dbPool.query(query, [professorId]);
        res.json(rows);
    } catch (error) {
        console.error('시간표 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '시간표를 불러오는데 실패했습니다.'
        });
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


// =============== 알림 관리 API ===============


// newServer.js에 추가
app.get('/api/notifications/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT 
                n.notification_id,
                sender.name as sender_name,
                n.title,
                n.content,
                n.is_read,
                n.created_at,
                n.sender_id
            FROM Notifications n
            JOIN users sender ON n.sender_id = sender.id
            WHERE n.receiver_id = ?
            ORDER BY n.created_at DESC`;

        const [notifications] = await dbPool.query(query, [userId]);
        res.json(notifications);
    } catch (error) {
        console.error('알림 조회 오류:', error);
        res.status(500).json({ message: '알림 목록을 불러오는데 실패했습니다.' });
    }
});

// 알림 읽음 처리 API
app.put('/api/notifications/:notificationId/read', async (req, res) => {
    const { notificationId } = req.params;

    try {
        await dbPool.query(
            'UPDATE Notifications SET is_read = TRUE WHERE notification_id = ?',
            [notificationId]
        );
        res.json({ message: '알림이 읽음 처리되었습니다.' });
    } catch (error) {
        console.error('알림 읽음 처리 오류:', error);
        res.status(500).json({ message: '알림 읽음 처리에 실패했습니다.' });
    }
});

// 답장 보내기 API
app.post('/api/notifications/reply', async (req, res) => {
    const { senderId, receiverId, title, content } = req.body;

    try {
        await dbPool.query(
            `INSERT INTO Notifications 
             (sender_id, receiver_id, title, content) 
             VALUES (?, ?, ?, ?)`,
            [senderId, receiverId, title, content]
        );
        res.json({ message: '답장이 전송되었습니다.' });
    } catch (error) {
        console.error('답장 전송 오류:', error);
        res.status(500).json({ message: '답장 전송에 실패했습니다.' });
    }
});

// newServer.js에 추가
// 알림 보내기 API
app.post('/api/notifications/send', async (req, res) => {
    const { sender_id, receiver_id, title, content } = req.body;

    try {
        const [result] = await dbPool.query(
            `INSERT INTO Notifications 
             (sender_id, receiver_id, title, content) 
             VALUES (?, ?, ?, ?)`,
            [sender_id, receiver_id, title, content]
        );

        res.json({
            success: true,
            message: '알림이 전송되었습니다.',
            notification_id: result.insertId
        });
    } catch (error) {
        console.error('알림 전송 오류:', error);
        res.status(500).json({
            success: false,
            message: '알림 전송에 실패했습니다.'
        });
    }
});



// =============== 학부모 관련 API ===============


// 서버에 API 추가
app.get('/api/parent/children/:parentId', async (req, res) => {
    const { parentId } = req.params;

    try {
        // 자녀 목록 조회
        const [children] = await dbPool.query(`
            SELECT u.* 
            FROM users u
            JOIN ParentChild pc ON u.id = pc.student_id
            WHERE pc.parent_id = ?`,
            [parentId]
        );

        res.json(children);
    } catch (error) {
        console.error('자녀 목록 조회 오류:', error);
        res.status(500).json({ message: '자녀 목록을 불러오는데 실패했습니다.' });
    }
});


// =============== 사용자 관리에 새로 추가한 API ===============


// 새 사용자 생성 API
app.post('/api/users', async (req, res) => {
    const { id, name, password, email, phone_number, role } = req.body;

    try {
        // 필수 필드 확인
        if (!id || !name || !password || !role) {
            return res.status(400).json({
                success: false,
                message: '필수 정보가 누락되었습니다.'
            });
        }

        // 사용자 ID 중복 확인
        const [existingUser] = await dbPool.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 ID입니다.'
            });
        }

        // 새 사용자 생성
        const [result] = await dbPool.query(
            `INSERT INTO users (id, name, password, email, phone_number, role)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, name, password, email, phone_number, role]
        );

        res.status(201).json({
            success: true,
            message: '사용자가 생성되었습니다.',
            userId: result.insertId
        });

    } catch (error) {
        console.error('사용자 생성 오류:', error);
        res.status(500).json({
            success: false,
            message: '사용자 생성 중 오류가 발생했습니다.'
        });
    }
});

// 학생-부모 연결 API
app.post('/api/parent-child', async (req, res) => {
    const { studentId, parentId } = req.body;
    const connection = await dbPool.getConnection();

    try {
        await connection.beginTransaction();

        // 학생과 부모가 존재하는지 확인
        const [student] = await connection.query(
            'SELECT * FROM users WHERE id = ? AND role = ?',
            [studentId, 'student']
        );

        const [parent] = await connection.query(
            'SELECT * FROM users WHERE id = ? AND role = ?',
            [parentId, 'parent']
        );

        if (student.length === 0) {
            throw new Error('존재하지 않는 학생입니다.');
        }

        if (parent.length === 0) {
            throw new Error('존재하지 않는 학부모입니다.');
        }

        // 이미 연결되어 있는지 확인
        const [existing] = await connection.query(
            'SELECT * FROM ParentChild WHERE parent_id = ? AND student_id = ?',
            [parentId, studentId]
        );

        if (existing.length > 0) {
            throw new Error('이미 연결된 관계입니다.');
        }

        // 연결 생성
        await connection.query(
            'INSERT INTO ParentChild (parent_id, student_id) VALUES (?, ?)',
            [parentId, studentId]
        );

        await connection.commit();

        res.json({
            success: true,
            message: '학생과 부모가 성공적으로 연결되었습니다.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('학생-부모 연결 오류:', error);
        res.status(400).json({
            success: false,
            message: error.message || '학생-부모 연결 중 오류가 발생했습니다.'
        });
    } finally {
        connection.release();
    }
});

// 학생의 부모 조회 API
app.get('/api/parent-child/student/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const [parents] = await dbPool.query(`
            SELECT u.* 
            FROM users u
            JOIN ParentChild pc ON u.id = pc.parent_id
            WHERE pc.student_id = ?`,
            [studentId]
        );

        res.json(parents);

    } catch (error) {
        console.error('부모 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '부모 정보 조회 중 오류가 발생했습니다.'
        });
    }
});

// 부모의 학생 조회 API
app.get('/api/parent-child/parent/:parentId', async (req, res) => {
    const { parentId } = req.params;

    try {
        const [students] = await dbPool.query(`
            SELECT u.* 
            FROM users u
            JOIN ParentChild pc ON u.id = pc.student_id
            WHERE pc.parent_id = ?`,
            [parentId]
        );

        res.json(students);

    } catch (error) {
        console.error('학생 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '학생 정보 조회 중 오류가 발생했습니다.'
        });
    }
});

// 학생-부모 연결 해제 API
app.delete('/api/parent-child', async (req, res) => {
    const { studentId, parentId } = req.body;

    try {
        await dbPool.query(
            'DELETE FROM ParentChild WHERE parent_id = ? AND student_id = ?',
            [parentId, studentId]
        );

        res.json({
            success: true,
            message: '연결이 해제되었습니다.'
        });

    } catch (error) {
        console.error('연결 해제 오류:', error);
        res.status(500).json({
            success: false,
            message: '연결 해제 중 오류가 발생했습니다.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});