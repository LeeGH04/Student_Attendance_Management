import React from 'react';
import SideBar from './SideBar';
import '../css/AnnouncementsPage.module.css'; // CSS 파일 import

const AnnouncementsPage = () => {
  return (
    <div className="main-container">
      <SideBar />
      <div className="content-container">
        <h1 className="announcement-title">공지사항</h1>
        <div className="search-section">
          <select className="filter-dropdown">
            <option>제목</option>
            <option>내용</option>
            <option>작성자</option>
          </select>
          <input className="search-input" type="text" placeholder="검색어를 입력하세요" />
          <button className="search-button">🔍</button>
        </div>
        <div className="announcement-list-placeholder">
          {/* 공지사항 리스트가 들어갈 자리 */}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;