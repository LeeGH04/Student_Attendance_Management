import React from 'react';
import '../css/AnnouncementsPage.css'; // CSS 파일 import

const AnnouncementsPage = () => {
  return (
    <div className="announcement-page">
      {/* 상단 제목 */}
      <h1 className="announcement-title">공지사항</h1>

      {/* 검색 섹션 */}
      <div className="search-section">
        <select className="filter-dropdown">
          <option>제목</option>
          <option>내용</option>
          <option>작성자</option>
        </select>
        <input className="search-input" type="text" placeholder="검색어를 입력하세요" />
        <button className="search-button">🔍</button>
      </div>

      {/* 공지사항 리스트 영역 */}
      <div className="announcement-list-placeholder">
        {/* 공지사항 리스트가 들어갈 자리 */}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
