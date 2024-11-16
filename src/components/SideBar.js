import React from 'react';
import {Home, Users, Settings, LogOut} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import styles from '../css/SideBar.module.css';
import '../css/Base.css';

const SideBar = () => {
    const navigate = useNavigate();
    const role = sessionStorage.getItem('userRole');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        return null;
    }

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className={styles.sidebar}>
            <h2>ㅇㅇ 학교</h2>
            <nav className={styles.sidebarNav}>
                <div className={styles.sidebarCategory}>Attendance</div>
                <ul>
                    {(role === 'student') && (
                        <li>
                            <button onClick={() => navigate('/AttendancePage')}>
                                <Home className={styles.icon}/>
                                <span className={styles.sidebarMenu}>출석 체크</span>
                            </button>
                        </li>
                    )}

                    {(role === 'student' || role === 'parent') && (
                        <li>
                            <button onClick={() => navigate('/AttendanceReportPage')}>
                                <Users className={styles.icon}/>
                                <span className={styles.sidebarMenu}>출석 보고서 확인</span>
                            </button>
                        </li>
                    )}

                    {role === 'professor' && (
                        <li>
                            <button onClick={() => navigate('/AttendanceReportCreatePage')}>
                                <Users className={styles.icon}/>
                                <span className={styles.sidebarMenu}>출석 보고서 작성</span>
                            </button>
                        </li>
                    )}

                    {(role === 'professor' || role === 'admin' || role === 'parent' || role === 'student') && (
                        <li>
                            <button onClick={() => navigate('/NotificationsPage')}>
                                <Settings className={styles.icon}/>
                                <span className={styles.sidebarMenu}>알림 확인</span>
                            </button>
                        </li>
                    )}
                </ul>

                <div className={styles.sidebarCategory}>Management</div>
                <ul>
                    <li>
                        <button onClick={() => navigate('/ProfileManagementPage')}>
                            <Home className={styles.icon}/>
                            <span className={styles.sidebarMenu}>개인정보 관리</span>
                        </button>
                    </li>
                </ul>

                <div className={styles.sidebarCategory}>Administration</div>
                <ul>
                    {(role === 'student' || role === 'professor' || role === 'parent' || role === 'admin') && (
                        <li>
                            <button onClick={() => navigate('/AnnouncementsPage')}>
                                <Settings className={styles.icon}/>
                                <span className={styles.sidebarMenu}>공지사항</span>
                            </button>
                        </li>
                    )}

                    {(role === 'admin' || role === 'professor') && (
                        <li>
                            <button onClick={() => navigate('/AttendanceManagementPage')}>
                                <Home className={styles.icon}/>
                                <span className={styles.sidebarMenu}>출석 관리</span>
                            </button>
                        </li>
                    )}

                    {role === 'admin' && (
                        <li>
                            <button onClick={() => navigate('/UserManagementPage')}>
                                <Users className={styles.icon}/>
                                <span className={styles.sidebarMenu}>사용자 관리</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            <button className={styles.logoutMenu} onClick={handleLogout}>
                <LogOut className={styles.logoutIcon}/>
                <span>로그아웃</span>
            </button>
        </div>
    );
};

export default SideBar;