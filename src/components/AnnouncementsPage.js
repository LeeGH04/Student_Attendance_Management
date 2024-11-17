import React, { useState, useEffect } from 'react';
import styles from '../css/AnnouncementsPage.module.css';
import '../css/Base.css';

const AnnouncementsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(""); // 작성일자 저장 상태 추가
  const [author, setAuthor] = useState(""); //작성자 상태 추가
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // contentEditable 사용
  const [announcements, setAnnouncements] = useState([]); //공지사항 목록 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('제목'); // 필터 옵션 상태 추가
  const [isLoadingAuthor, setIsLoadingAuthor] = useState(false);

  // 검색 입력 변화 처리
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 필터 옵션 변경 처리
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // 검색된 공지사항 필터링
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (selectedOption === "제목") {
      return announcement.title.includes(searchQuery);
    } else if (selectedOption === "내용") {
      return announcement.content.includes(searchQuery);
    } else if (selectedOption === "작성자") {
      return announcement.author.includes(searchQuery);
    }
    return false;
  });

  // 모달이 열릴 때마다 최신 날짜를 설정
  useEffect(() => {

    if (showModal) {
      console.log("모달이 열렸습니다. 작성자 정보를 가져옵니다...");
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);

      setIsLoadingAuthor(true); //로딩 시작

      fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Authorization에 토큰을 포함
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('인증 실패: 유효하지 않은 토큰입니다.');
          }
          return res.json();
        })
        .then((data) => {
          console.log("Fetched Uwer Data :", data) //API에서 반환된 사용자
          setAuthor(data?.name || "알 수 없는 사용자");
          setIsLoadingAuthor(false);//로딩 완료
        })
        .catch((error) => {
          console.error("사용자 정보를 가져오는데 실패했습니다.", error);
          setAuthor("알 수 없는 사용자");
          setIsLoadingAuthor(false);//로딩 완료(오류 처리)
         alert('작성자 정보를 가져오는 데 실패했습니다 . 다시 시도해주세요');
        });
    }
  }, [showModal]);

  const openModal = () => {
    const today = new Date().toISOString().split('T')[0]; //'yyyy-mm-dd'형식으로 변환
    setCurrentDate(today); //현재 날짜를 상태에 설정
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTitle(""); //제목 초기화
    setContent(""); //내용 초기화
    setCurrentDate(""); //작성일자 초기화
    setAuthor(""); //작성자 초기화(로딩 중 상태만 보여주기)
  };

  const handleContentChange = (e) => {
    setContent(e.target.innerHTML); // contentEditable의 내용을 상태에 반영
  };

  const saveAnnouncement = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요!');
      return;
    }

    // 값 확인
    console.log("제목:", title);
    console.log("내용:", content);

    const announcementData = {
      id: Date.now(),
      title,
      content,
      author,
      createdDate: currentDate
    };

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        throw new Error('공지사항 저장에 실패했습니다.');
      }

      const savedAnnouncement = await response.json(); // 저장된 공지사항
      setAnnouncements((prevAnnouncements) => [savedAnnouncement, ...prevAnnouncements]);
      closeModal(); // 모달 닫기 및 상태 초기화
    } catch (error) {
      console.error('공지사항 저장에 오류가 발생했습니다.', error);
      alert('공지사항 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="main-container">
      <div className="content-container">
        <h1 className="title">공지사항</h1>
        <div className={styles.searchSection}>
          <select className={styles.filterDropdown} value={selectedOption} onChange={handleSelectChange}>
            <option value="제목">제목</option>
            <option value="내용">내용</option>
            <option value="작성자">작성자</option>
          </select>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className={styles.searchButton}>🔍</button>
          <button className={styles.writeButton} onClick={openModal}>글쓰기</button>
        </div>
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className={styles.announcementItem}>
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <span>{announcement.author} | {announcement.createdDate}</span>
            </div>
          ))
        ) : (
          <p>등록된 공지사항이 없습니다.</p>
        )}

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>새 공지사항</h2>
              <input
                type="text"
                placeholder="제목"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className={styles.textarea}
                contentEditable
                placeholder="내용"
                dangerouslySetInnerHTML={{ __html: content }} // contentEditable을 위해 HTML을 표시
                onInput={handleContentChange} // 내용 변경 시 상태 업데이트
              />
              <input
                type="text"
                placeholder="작성자"
                className={styles.input}
                value={isLoadingAuthor ?  '로딩 중...' : author ||""}
                readOnly
              />
              <input
                type="date"
                placeholder="작성일자"
                className={styles.input}
                value={currentDate}
              />
              <button onClick={saveAnnouncement} className={styles.saveButton}>저장</button>
              <button onClick={closeModal} className={styles.closeButton}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
