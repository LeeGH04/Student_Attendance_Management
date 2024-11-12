import React, { useEffect } from "react";
import styles from '../css/NotificationsPage.module.css';
import '../css/Base.css';

const NotificationsPage = () => {

  useEffect(() => {
    if (Notification.permission === 'granted') {
      new Notification('This is a notification!');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('This is a notification!');
        }
      });
    }
  }, []);

  return (
      <div className="main-container">
        <div className="content-container">
          <h1 className="title">알림</h1>

          {/*<div className={styles.mainContent}>*/}
          {/*  <div className={styles.rightContainer}>*/}
          {/*  </div>*/}
          {/*</div>*/}

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
            <tr>
              <td>1</td>
              <td>김민수</td>
              <td></td>
              <td>읽기 전</td>
              <td></td>
              <td>2024-11-11</td>
            </tr>
            <tr>
              <td>2</td>
              <td>엄휘찬</td>
              <td></td>
              <td>읽기 전</td>
              <td></td>
              <td>2024-11-11</td>
            </tr>
            <tr>
              <td>3</td>
              <td>주사랑</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-11-10</td>
            </tr>
            <tr>
              <td>4</td>
              <td>이수정</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-11-8</td>
            </tr>
            <tr>
              <td>5</td>
              <td>최은솔</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-11-1</td>
            </tr>
            <tr>
              <td>6</td>
              <td>이건휘</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-11-1</td>
            </tr>
            <tr>
              <td>7</td>
              <td>이원주</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-10-28</td>
            </tr>
            <tr>
              <td>8</td>
              <td>조규철</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-10-22</td>
            </tr>
            <tr>
              <td>9</td>
              <td>민정혜</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-10-21</td>
            </tr>
            <tr>
              <td>10</td>
              <td>문영준</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-9-17</td>
            </tr>
            <tr>
              <td>11</td>
              <td>최성수</td>
              <td></td>
              <td>읽음</td>
              <td></td>
              <td>2024-9-16</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default NotificationsPage;