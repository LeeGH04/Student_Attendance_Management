import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [studentId, setStudentId] = useState('');  // 학번을 저장
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 훅

  const handleLogin = async (e) => {
    e.preventDefault();  // 폼 제출 시 새로 고침 방지

    console.log('학번:', studentId);  // 학번 확인
    console.log('비밀번호:', password);  // 비밀번호 확인

    try {
      // 서버로 로그인 요청 보내기
      const response = await axios.post('http://localhost:5002/login', {
        student_id: studentId,  // 학번을 보냄
        password: password,
      });

      console.log('서버 응답:', response);  // 서버 응답 확인

      if (response.status === 200) {
        console.log('로그인 성공:', response.data.message);
        // 로그인 성공 시 로컬 스토리지에 로그인 상태 저장
        localStorage.setItem('isLoggedIn', 'true');
        // 메인 페이지로 리다이렉트
        navigate('/main');
      } else {
        setError('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      // 네트워크 오류와 응답 오류 구분
      if (error.response) {
        // 서버에서 오류 응답이 있을 경우
        console.log('서버 오류:', error.response);  // 서버에서 받은 오류 로그
        if (error.response.status === 401) {
          setError('잘못된 학번 또는 비밀번호입니다.');
        } else {
          setError(`서버 오류: ${error.response.data.message}`);
        }
      } else if (error.request) {
        // 요청이 보내졌지만 응답을 받지 못한 경우
        console.log('요청 오류:', error.request);
        setError('서버와 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
      } else {
        // 그 외 오류
        console.log('오류:', error.message);
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="screen">
      <div className="login-container">
        <div className="text-wrapper">로그인</div>

        {/* form 태그로 변경 */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="label">학번</label>
            <input
              type="text"
              className="input"
              placeholder="학번을 입력하세요"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="password-reset" style={{ cursor: 'pointer' }}>
          비밀번호 찾기
        </div>
      </div>
    </div>
  );
};

export default LoginPage;