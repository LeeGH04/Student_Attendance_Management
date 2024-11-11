import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentMain from './components/StudentMain';
import AttendancePage from './components/AttendancePage';
import ProfessorMain from './components/ProfessorMain';
import AdminMain from './components/AdminMain';
import ParentMain from './components/ParentMain';
import AnnouncementPage from './components/AnnouncementsPage';  // 예시로 추가한 공지사항 페이지
import NotificationsPage from './components/NotificationsPage';  // 알림 페이지 임포트 추가
import PrivateRoute from './components/PrivateRoute';
import ProfileManagement from './components/ProfileManagement';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* 학생 전용 메인 페이지 */}
                <Route
                    path="/student-main"
                    element={
                        <PrivateRoute>
                            <StudentMain />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/AttendancePage"
                    element={
                        <PrivateRoute>
                            <AttendancePage />
                        </PrivateRoute>
                    }
                />

                {/* 교수 전용 메인 페이지 */}
                <Route
                    path="/professor-main"
                    element={
                        <PrivateRoute>
                            <ProfessorMain />
                        </PrivateRoute>
                    }
                />

                {/* 학부모 전용 메인 페이지 */}
                <Route
                    path="/parent-main"
                    element={
                        <PrivateRoute>
                            <ParentMain />
                        </PrivateRoute>
                    }
                />

                {/* 관리자 전용 메인 페이지 */}
                <Route
                    path="/admin-main"
                    element={
                        <PrivateRoute>
                            <AdminMain />
                        </PrivateRoute>
                    }
                />

                {/* 공지사항 페이지 추가 */}
                <Route
                    path="/Announcements"
                    element={
                        <PrivateRoute>
                            <AnnouncementPage />
                        </PrivateRoute>
                    }
                />

                {/* 알림 페이지 추가 */}
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute>
                            <NotificationsPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ProfileManagement"
                    element={
                        <PrivateRoute>
                            <ProfileManagement />
                        </PrivateRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;