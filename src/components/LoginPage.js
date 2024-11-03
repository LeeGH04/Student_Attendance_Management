import React from 'react';
import loginImage from '../images/loginp.png'; // 로그인 이미지 경로 확인
import '../css/LoginPage.css'; // CSS 경로 확인

const LoginPage = () => {
  return (
    <div className="screen">
      <div className="div">
        <div className="overlap">
          <div className="text-wrapper">회원가입</div>
          <div className="text-wrapper-2">아이디 찾기</div>
          <div className="text-wrapper-3">비밀번호 찾기</div>

          <img
            className="pngtree-school-logo"
            alt="Login Image"
            src={loginImage} // 이미지 경로
          />

          {/* 추가적인 UI 구성 요소 */}
          <div className="group">
            <div className="overlap-group">
              <div className="text-wrapper-4">로그인</div>
            </div>
          </div>

          <div className="overlap-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-5">아이디</div>
            </div>
          </div>

          <div className="overlap-group-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-6">비밀번호</div>
            </div>
          </div>

          <div className="group-2">
            <div className="overlap-2">
              <div className="text-wrapper-7">LOGIN</div>
            </div>
          </div>
        </div>

        {/* 역할 선택 버튼 */}
        <div className="group-3">
          <div className="overlap-3">
            <div className="text-wrapper-8">학생</div>
          </div>
        </div>

        <div className="group-4">
          <div className="overlap-4">
            <div className="text-wrapper-8">교수</div>
          </div>
        </div>

        <div className="group-5">
          <div className="overlap-5">
            <div className="text-wrapper-9">학부모</div>
          </div>
        </div>

        <div className="group-6">
          <div className="overlap-6">
            <div className="text-wrapper-9">관리자</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;