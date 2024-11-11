// ParentMain.js
import React from 'react';
import SideBar from './SideBar';
import '../css/ParentMain.css';
//
const ParentMain = () => {
    return (
        <div className="main-container">
            <SideBar />
            <div className="content-container">
                <div className="header">
                    <h1 className="title">수업 현황</h1>
                </div>
                <div className="statistics-container">
                    <div className="attendance-status">
                        <h2>현재 출석 현황</h2>
                        <div className="bar-line-chart"></div>
                    </div>
                    <div className="total-attendance">
                        <h2>총 출석 현황</h2>
                        <div className="pie-chart"></div>
                    </div>
                    <div className="notice">
                        <h2>공지사항</h2>
                        <div className="notice-content"></div>
                    </div>
                </div>
                <div className="timetable">
                    <h2>시간표</h2>
                    <div className="timetable-content"></div>
                </div>
            </div>
        </div>
    );
};

export default ParentMain;