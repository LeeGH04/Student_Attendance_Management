import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SideBar from './components/SideBar';
import './App.css';

// PrivateRoute 컴포넌트: 로그인 여부를 확인하고 로그인되지 않은 경우 로그인 페이지로 리다이렉트
const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // 로그인 상태 확인

    if (!isLoggedIn) {
        return <Navigate to="/login" />;  // 로그인되지 않으면 로그인 페이지로 이동
    }

    return (
        <div className="app-layout">
            <SideBar /> {/* 사이드바 컴포넌트 */}
            <div className="main-content">
                {children} {/* children은 MainPage를 의미 */}
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
                <Route
                    path="/main"
                    element={
                        <PrivateRoute>
                            <MainPage /> {/* 로그인 상태라면 MainPage를 렌더링 */}
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} /> {/* 기본 경로에서 로그인 페이지로 리다이렉트 */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;