import React from 'react';
import { Navigate } from 'react-router-dom';
import SideBar from './SideBar';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole'); // 사용자 권한 가져오기

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // 로그인 상태에 맞는 역할에 따라 페이지를 렌더링
    if (role === 'student') {
        return (
            <div className="app-layout">
                <SideBar />
                <div className="main-content">
                    {children} {/* 학생 메인 페이지 등 렌더링 */}
                </div>
            </div>
        );
    } else if (role === 'professor') {
        return (
            <div className="app-layout">
                <SideBar />
                <div className="main-content">
                    {children} {/* 교수 메인 페이지 등 렌더링 */}
                </div>
            </div>
        );
    } else if (role === 'admin') {
        return (
            <div className="app-layout">
                <SideBar />
                <div className="main-content">
                    {children} {/* 관리자 페이지 등 렌더링 */}
                </div>
            </div>
        );
    } else if (role === 'parent') {
        return (
            <div className="app-layout">
                <SideBar />
                <div className="main-content">
                    {children} {/* 부모 페이지 등 렌더링 */}
                </div>
            </div>
        );
    }

    // 기본적으로는 자식 컴포넌트를 반환
    return (
        <div className="app-layout">
            <SideBar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default PrivateRoute;