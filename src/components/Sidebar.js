import React from 'react';
import { Home, Calendar, Settings } from 'lucide-react';
import '../css/SideBar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>ㅇㅇ 학교</h2>
            <nav>
                <ul>
                    <li>
                        <button>
                            <Home className="icon" />
                            <span>홈</span>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Calendar className="icon" />
                            <span>일정</span>
                        </button>
                    </li>
                    <li>
                        <button>
                            <Settings className="icon" />
                            <span>설정</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;