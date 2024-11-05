import React, { useState } from 'react';
import loginImage from '../images/loginp.png'; // 로그인 이미지 경로 확인
import '../css/LoginPage.css'; // CSS 경로 확인

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 처리 로직 (예: API 호출)
    console.log('아이디:', username, '비밀번호:', password);
  };

  const handlePasswordReset = () => {
    // 비밀번호 찾기 처리 로직
    console.log('비밀번호 찾기 클릭');
  };

  return (
    <div className="screen">
      <div className="login-container">
        <div className="text-wrapper">로그인</div>
        
        <div className="input-group">
          <label className="label">학번</label>
          <input
            type="text"
            className="input"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="label">비밀번호</label>
          <input
            type="password"
            className="input"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-button" onClick={handleLogin} style={{ cursor: 'pointer' }}>
          로그인
        </div>

        <div className="password-reset" onClick={handlePasswordReset} style={{ cursor: 'pointer' }}>
          비밀번호 찾기
        </div>
      </div>
    </div>
  );
};

export default LoginPage;