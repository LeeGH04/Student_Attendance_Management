// src/App.js
import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentMain from './components/StudentMain';
import ProfessorMain from './components/ProfessorMain';
import AdminMain from './components/AdminMain';
import ParentMain from './components/ParentMain';
import PrivateRoute from './components/PrivateRoute';
import AnnouncementsPage from './components/AnnouncementsPage';  // 예시로 추가한 공지사항 페이지
import AttendancePage from './components/AttendancePage';
import AttendanceReportCreatePage from './components/AttendanceReportCreatePage';
import AttendanceReportPage from './components/AttendanceReportPage';
import NotificationsPage from './components/NotificationsPage';  // 알림 페이지 임포트 추가
import ProfileManagementPage from './components/ProfileManagementPage';
import UserManagementPage from './components/UserManagementPage';

import './App.css';
import AttendanceManagementPage from "./components/AttendanceManagementPage";

function App() {
    useEffect(() => {
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome) {
            document.body.style.zoom = "75%";
        }
    }, []);

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
                    path="/professor-main"
                    element={
                        <PrivateRoute>
                            <ProfessorMain />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/parent-main"
                    element={
                        <PrivateRoute>
                            <ParentMain />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin-main"
                    element={
                        <PrivateRoute>
                            <AdminMain />
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

                <Route
                    path="/AnnouncementsPage"
                    element={
                        <PrivateRoute>
                            <AnnouncementsPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/NotificationsPage"
                    element={
                        <PrivateRoute>
                            <NotificationsPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ProfileManagementPage"
                    element={
                        <PrivateRoute>
                            <ProfileManagementPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/UserManagementPage"
                    element={
                        <PrivateRoute>
                            <UserManagementPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/AttendanceReportCreatePage"
                    element={
                        <PrivateRoute>
                            <AttendanceReportCreatePage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/AttendanceReportPage"
                    element={
                        <PrivateRoute>
                            <AttendanceReportPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/AttendanceManagementPage"
                    element={
                        <PrivateRoute>
                            <AttendanceManagementPage />
                        </PrivateRoute>
                    }
                />



                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;