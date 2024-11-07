import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <div className="sidebar">
            <h2>ㅇㅇ 학교</h2>
            <nav>
                {/* Attendance 카테고리 */}
                <div className="sidebar-category">Attendance</div>
                <ul>
                    <li>
                        <button onClick={() => navigate('/AttendancePage')}>
                            <Home className="icon" />
                            <span>출석 체크</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/attendance-report')}>
                            <Users className="icon" />
                            <span>출석 보고서 확인</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/notifications')}>
                            <Settings className="icon" />
                            <span>알림 확인</span>
                        </button>
                    </li>
                </ul>

                {/* Management 카테고리 */}
                <div className="sidebar-category">Management</div>
                <ul>
                    <li>
                        <button onClick={() => navigate('/profile-management')}>
                            <Home className="icon" />
                            <span>개인정보 관리</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/appeal')}>
                            <Users className="icon" />
                            <span>이의 신청</span>
                        </button>
                    </li>
                </ul>

                {/* Administration 카테고리 */}
                <div className="sidebar-category">Administration</div>
                <ul>
                    <li>
                        <button onClick={() => navigate('/announcements')}>
                            <Settings className="icon" />
                            <span>공지사항</span>
                        </button>
                    </li>
                </ul>

                {/* 로그아웃 버튼 */}
                <button onClick={handleLogout}>
                    <LogOut className="icon" />
                    <span>로그아웃</span>
                </button>
            </nav>
        </div>
    );
};

export default SideBar;