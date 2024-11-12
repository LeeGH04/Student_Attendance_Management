import React from 'react';
import styles from '../css/AnnouncementsPage.module.css';
import '../css/Base.css';

const AnnouncementsPage = () => {
  return (
      <div className="main-container">
        <div className="content-container">
          <h1 className="title">공지사항</h1>
          <div className={styles.searchSection}>
            <select className={styles.filterDropdown}>
              <option>제목</option>
              <option>내용</option>
              <option>작성자</option>
            </select>
            <input
                className={styles.searchInput}
                type="text"
                placeholder="검색어를 입력하세요"
            />
            <button className={styles.searchButton}>🔍</button>
          </div>
          <div className={styles.announcementListPlaceholder}>
            {/* 공지사항 리스트가 들어갈 자리 */}
          </div>
        </div>
      </div>
  );
};

export default AnnouncementsPage;