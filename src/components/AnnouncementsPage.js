import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import styles from '../css/AnnouncementsPage.module.css';
import '../css/Base.css';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 사용자 역할 확인
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);

    // 공지사항 목록 불러오기
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/announcements');
      if (!response.ok) throw new Error('공지사항을 불러오는데 실패했습니다.');
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAnnouncements();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
          `http://localhost:5002/api/announcements/search?type=${searchType}&query=${searchQuery}`
      );
      if (!response.ok) throw new Error('검색에 실패했습니다.');
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error('공지사항 등록에 실패했습니다.');

      await fetchAnnouncements();
      setShowModal(false);
      setTitle('');
      setContent('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:5002/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
      });

      if (!response.ok) throw new Error('삭제에 실패했습니다.');
      fetchAnnouncements();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}><AlertCircle /> {error}</div>;

  return (
      <div className="main-container">
        <div className="content-container">
          <div className={styles.header}>
            <h1 className="title">공지사항</h1>
            {(userRole === 'admin' || userRole === 'professor') && (
                <button
                    className={styles.writeButton}
                    onClick={() => setShowModal(true)}
                >
                  글쓰기
                </button>
            )}
          </div>

          <div className={styles.searchSection}>
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className={styles.searchSelect}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="author">작성자</option>
            </select>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className={styles.searchInput}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
                onClick={handleSearch}
                className={styles.searchButton}
            >
              검색
            </button>
          </div>

          <div className={styles.announcementList}>
            {announcements.length > 0 ? (
                announcements.map((announcement) => (
                    <div key={announcement.announcement_id} className={styles.announcementItem}>
                      <div className={styles.announcementHeader}>
                        <h3>{announcement.title}</h3>
                        {(userRole === 'admin' || announcement.author_id === sessionStorage.getItem('userId')) && (
                            <button
                                onClick={() => handleDelete(announcement.announcement_id)}
                                className={styles.deleteButton}
                            >
                              삭제
                            </button>
                        )}
                      </div>
                      <div className={styles.announcementContent}>
                        {announcement.content}
                      </div>
                      <div className={styles.announcementFooter}>
                        <span>작성자: {announcement.author_name}</span>
                        <span>작성일: {formatDate(announcement.created_at)}</span>
                      </div>
                    </div>
                ))
            ) : (
                <div className={styles.noAnnouncements}>
                  등록된 공지사항이 없습니다.
                </div>
            )}
          </div>

          {showModal && (
              <div className={styles.modal} onClick={() => setShowModal(false)}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <h2>공지사항 작성</h2>
                  <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className={styles.modalInput}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        className={styles.modalTextarea}
                    />
                    <div className={styles.modalButtons}>
                      <button type="submit">등록</button>
                      <button type="button" onClick={() => setShowModal(false)}>
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AnnouncementsPage;