import React, { useEffect } from "react";
import '../css/NotificationsPage.css';

const NotificationsPage = () => {

  useEffect(() => {
    // 알림 권한 확인 후 알림 표시
    if (Notification.permission === 'granted') {
      new Notification('This is a notification!'); // new 연산자 추가
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('This is a notification!'); // new 연산자 추가
        }
      });
    }
  }, []);

  return (
    <div className="notifications-page">
      <div className="text-wrapper">알림 페이지</div>
    </div>
  );
};

export default NotificationsPage;