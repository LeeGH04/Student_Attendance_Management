import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import '../css/Mainpage.css';

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
    };


};

export default SideBar;