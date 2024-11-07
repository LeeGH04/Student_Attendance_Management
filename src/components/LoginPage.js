import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import loginImage from '../images/loginp.png';

const LoginPage = () => {
  const [id, setId] = useState('');  // 학번을 저장
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 훅

  const handleLogin = async (e) => {
    e.preventDefault();  // 폼 제출 시 새로 고침 방지

    // 보내는 데이터 확인
    console.log("보내는 데이터:", { id, password });

    try {
      // 서버로 로그인 요청 보내기
      const response = await axios.post('http://localhost:5002/login', {
        id: id,
        password: password,
      });

      if (response.status === 200) {
        const { message, role } = response.data;

        console.log('로그인 성공:', message);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role); // role 저장

        // 권한에 따라 페이지 이동
        if (role === 'student') {
          navigate('/student-main');
        } else if (role === 'professor') {
          navigate('/professor-main');
        } else if (role === 'admin') {
          navigate('/admin-main');
        } else if (role === 'parent') {
          navigate('/parent-main');
        } 
      } else {
        setError('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      if (error.response) {
        console.log('서버 오류:', error.response);
        if (error.response.status === 401) {
          setError('잘못된 학번 또는 비밀번호입니다.');
        } else {
          setError(`서버 오류: ${error.response.data.message}`);
        }
      } else if (error.request) {
        console.log('요청 오류:', error.request);
        setError('서버와 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
      } else {
        console.log('오류:', error.message);
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="screen">
      <div className="login-container">
        <div className="login-icon-section">
          {/* 여기에 큰 아이콘 */}
          <img src={loginImage} alt="login icon" />
          {/*<YourIcon className="w-64 h-64"/> /!* 아이콘 크기 예시 *!/*/}
        </div>
        <div className="login-form-section">
          <div className="text-wrapper">로그인</div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="label">학번</label>
              <input
                  type="text"
                  className="input"
                  placeholder="학번을 입력하세요"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
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
          <div className="password-reset" style={{cursor: 'pointer'}}>
            비밀번호 찾기
          </div>
        </div>
      </div>

      </div>
      );
      };

      export default LoginPage;