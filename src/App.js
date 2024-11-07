// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentMain from './components/StudentMain';
import AttendancePage from './components/AttendancePage';
import ProfessorMain from './components/ProfessorMain';
import AdminMain from './components/AdminMain';
import ParentMain from './components/ParentMain';
import PrivateRoute from './components/PrivateRoute';
import SideBar from './components/SideBar';
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

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;