import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole'); // 역할 정보 가져오기

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole'); // 역할 정보 삭제
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <div className="sidebar">
            <h2>ㅇㅇ 학교</h2>
            <nav className="sidebar-nav">
                {/* Attendance 카테고리 */}
                <div className="sidebar-category">Attendance</div>
                <ul>
                    {/* 학생과 학부모에게 출석 체크 버튼 보이기 */}
                    {(role === 'student') && (
                        <li>
                            <button onClick={() => navigate('/AttendancePage')}>
                                <Home className="icon" />
                                <span>출석 체크</span>
                            </button>
                        </li>
                    )}

                    {/* 학생과 학부모에게 출석 보고서 확인 버튼 보이기 */}
                    {(role === 'student' || role === 'parent') && (
                        <li>
                            <button onClick={() => navigate('/attendance-report')}>
                                <Users className="icon" />
                                <span>출석 보고서 확인</span>
                            </button>
                        </li>
                    )}

                    {/* 교수에게는 출석 보고서 작성 버튼을 보이게 함 */}
                    {role === 'professor' && (
                        <li>
                            <button onClick={() => navigate('/attendance-report-create')}>
                                <Users className="icon" />
                                <span>출석 보고서 작성</span>
                            </button>
                        </li>
                    )}

                    {/* 알림 확인은 교수, 관리자, 학부모에게만 보이게 */}
                    {role === 'professor' || role === 'admin' || role === 'parent' || role === 'student' ? (
                        <li>
                            <button onClick={() => navigate('/notifications')}>
                                <Settings className="icon" />
                                <span>알림 확인</span>
                            </button>
                        </li>
                    ) : null}
                </ul>

                {/* Management 카테고리 */}
                <div className="sidebar-category">Management</div>
                <ul>
                    {/* 개인정보 관리는 모든 사용자에게 보이게 */}
                    <li>
                        <button onClick={() => navigate('/profile-management')}>
                            <Home className="icon" />
                            <span>개인정보 관리</span>
                        </button>
                    </li>

                    {/* 이의 신청은 학생만 볼 수 있게 */}
                    {role === 'student' && (
                        <li>
                            <button onClick={() => navigate('/appeal')}>
                                <Users className="icon" />
                                <span>이의 신청</span>
                            </button>
                        </li>
                    )}

                    {/* 교수는 출석 관리와 수업 코드 생성 버튼을 볼 수 있게 */}
                    {role === 'professor' && (
                        <>
                            <li>
                                <button onClick={() => navigate('/create-class-code')}>
                                    <Home className="icon" />
                                    <span>수업 코드 생성</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>

                {/* Administration 카테고리 */}
                <div className="sidebar-category">Administration</div>
                <ul>
                    {/* 모든 사용자에게 공지사항을 보이게 */}
                    {role === 'student' || role === 'professor' || role === 'parent' || role === 'admin' ? (
                        <li>
                            <button onClick={() => navigate('/announcements')}>
                                <Settings className="icon" />
                                <span>공지사항</span>
                            </button>
                        </li>
                    ) : null}

                    {/* 관리자와 교수만 출석 관리 버튼을 볼 수 있게 */}
                    {role === 'admin' || role === 'professor' ? (
                        <li>
                            <button onClick={() => navigate('/attendance-management')}>
                                <Home className="icon" />
                                <span>출석 관리</span>
                            </button>
                        </li>
                    ) : null}

                    {/* 관리자만 사용자 관리 버튼을 볼 수 있게 */}
                    {role === 'admin' && (
                        <li>
                            <button onClick={() => navigate('/user-management')}>
                                <Users className="icon" />
                                <span>사용자 관리</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            {/* 로그아웃 버튼 - 하단에 배치 */}
            <button className="logout-button" onClick={handleLogout}>
                <LogOut className="icon" />
                <span>로그아웃</span>
            </button>
        </div>
    );
};

export default SideBar;
