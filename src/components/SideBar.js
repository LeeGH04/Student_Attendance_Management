import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../css/SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');  // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <div className="sidebar">
            <h2>ㅇㅇ 학교</h2>
            <nav>
                <ul>
                    <li>
                        <button onClick={() => navigate('/main')}>
                            <Home className="icon" />
                            <span>홈</span>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Users className="icon" />
                            <span>사용자</span>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Settings className="icon" />
                            <span>설정</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLogout}>
                            <LogOut className="icon" />
                            <span>로그아웃</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SideBar;