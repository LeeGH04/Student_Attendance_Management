require('dotenv').config(); // .env 파일 사용
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5002;

// CORS 설정
app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 연결 풀 설정
const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'jj021204!@',
    database: process.env.DB_NAME || 'eundata',
});

// 회원가입 라우트 (학번으로 가입)
app.post('/signup', async (req, res) => {
    const { id, password, role } = req.body;  // role도 추가받아야 할 수 있음

    try {
        // 사용자 정보를 users 테이블에 삽입 (비밀번호 해싱 없이)
        const [result] = await dbPool.execute(
            'INSERT INTO users (id, password, role) VALUES (?, ?, ?)', 
            [id, password, role]  // id, password, role 삽입
        );

        if (result.affectedRows > 0) {
            res.json({ success: true, message: '회원가입 성공!' });
        } else {
            res.status(500).json({ success: false, message: '회원가입에 실패했습니다.' });
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
    }
});

// 로그인 라우트 (학번으로 로그인)
app.post('/login', async (req, res) => {
    const { id, password } = req.body;  // email을 student_id로 변경

    try {
        // 학번으로 사용자 검색 (users 테이블 사용)
        const [rows] = await dbPool.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        const user = rows[0];

        // 비밀번호 비교
        if (password === user.password) {
            res.json({ success: true, message: '로그인 성공!', role: user.role });
        } else {
            res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});