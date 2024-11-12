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
            res.json({ success: true, message: '로그인 성공!', token, role: user.role });
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});