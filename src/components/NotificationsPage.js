import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from '../css/NotificationsPage.module.css';
import '../css/Base.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [replyModal, setReplyModal] = useState({ show: false, to: null });
  const [sendModal, setSendModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [newNotification, setNewNotification] = useState({
    receiver_id: '',
    title: '',
    content: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchNotifications();
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 사용자 검색 기능
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5002/api/users/search?query=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('사용자 검색 실패:', error);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  const handleSendNotification = async () => {
    try {
      await axios.post('http://localhost:5002/api/notifications/send', {
        sender_id: userId,
        ...newNotification
      });

      setSendModal(false);
      setNewNotification({ receiver_id: '', title: '', content: '' });
      setSearchQuery('');
      alert('알림이 전송되었습니다.');
    } catch (error) {
      console.error('알림 전송 실패:', error);
      alert('알림 전송에 실패했습니다.');
    }
  };

  const handleRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5002/api/notifications/${notificationId}/read`);
      fetchNotifications();  // 목록 새로고침
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const handleReply = async (recipientId) => {
    try {
      await axios.post('http://localhost:5002/api/notifications/reply', {
        senderId: userId,
        receiverId: recipientId,
        title: '답장',
        content: replyContent
      });
      setReplyModal({ show: false, to: null });
      setReplyContent('');
      alert('답장이 전송되었습니다.');
    } catch (error) {
      console.error('답장 전송 실패:', error);
      alert('답장 전송에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
      <div className="main-container">
        <div className="content-container">
          <div className={styles.header}>
            <h1 className="title">알림</h1>
            <button
                className={styles.sendButton}
                onClick={() => setSendModal(true)}
            >
              새 알림 작성
            </button>
          </div>

          <table className={styles.notificationTable}>
            <thead>
            <tr>
              <th>번호</th>
              <th>보낸이</th>
              <th>제목</th>
              <th>읽음</th>
              <th>답장</th>
              <th>받은 날짜</th>
            </tr>
            </thead>
            <tbody>
            {notifications.map((notification, index) => (
                <tr key={notification.notification_id}>
                  <td>{notifications.length - index}</td>
                  <td>{notification.sender_name}</td>
                  <td>{notification.title}</td>
                  <td>
                    {notification.is_read ? (
                        '읽음'
                    ) : (
                        <button onClick={() => handleRead(notification.notification_id)}>
                          읽기
                        </button>
                    )}
                  </td>
                  <td>
                    <button
                        onClick={() => setReplyModal({
                          show: true,
                          to: notification.sender_id
                        })}
                    >
                      답장
                    </button>
                  </td>
                  <td>{formatDate(notification.created_at)}</td>
                </tr>
            ))}
            </tbody>
          </table>
          {sendModal && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>새 알림 작성</h2>

                  <div className={styles.inputGroup}>
                    <label>받는 사람</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="이름 또는 ID로 검색"
                    />
                    {searchResults.length > 0 && (
                        <ul className={styles.searchResults}>
                          {searchResults.map(user => (
                              <li
                                  key={user.id}
                                  onClick={() => {
                                    setNewNotification(prev => ({
                                      ...prev,
                                      receiver_id: user.id
                                    }));
                                    setSearchQuery(`${user.name} (${user.id})`);
                                    setSearchResults([]);
                                  }}
                              >
                                {user.name} ({user.id}) - {user.role}
                              </li>
                          ))}
                        </ul>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                        placeholder="제목을 입력하세요"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>내용</label>
                    <textarea
                        value={newNotification.content}
                        onChange={(e) => setNewNotification(prev => ({
                          ...prev,
                          content: e.target.value
                        }))}
                        placeholder="내용을 입력하세요"
                    />
                  </div>

                  <div className={styles.modalButtons}>
                    <button onClick={handleSendNotification}>
                      전송
                    </button>
                    <button onClick={() => {
                      setSendModal(false);
                      setNewNotification({ receiver_id: '', title: '', content: '' });
                      setSearchQuery('');
                    }}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
          )}
          {replyModal.show && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>답장 작성</h2>
                  <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답장 내용을 입력하세요"
                  />
                  <div className={styles.modalButtons}>
                    <button onClick={() => handleReply(replyModal.to)}>
                      전송
                    </button>
                    <button onClick={() => setReplyModal({ show: false, to: null })}>
                      취소
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default NotificationsPage;