import { useState, useEffect } from 'react';
import styles from '../css/ProfileManagementPage.module.css';
import '../css/Base.css';

const ProfileManagementPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    id: '',
    email: '',
    phone_number: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5002/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('서버에서 데이터를 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/updateUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('수정된 정보 저장 성공');
      } else {
        console.error('서버에 수정된 정보 전송 실패');
      }
    } catch (error) {
      console.error('수정된 정보 전송 오류:', error);
    }
  };

  return (
      <div className="main-container">
        <div className="content-container">
          <h1 className="title">개인정보 관리</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.profileField}>
              <label htmlFor="name">이름:</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  readOnly
                  className={styles.readonlyField}
              />
            </div>
            <div className={styles.profileField}>
              <label htmlFor="id">학번:</label>
              <input
                  type="text"
                  id="id"
                  name="id"
                  value={userData.id}
                  readOnly
                  className={styles.readonlyField}
              />
            </div>
            <div className={styles.profileField}>
              <label htmlFor="email">이메일:</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={styles.editableField}
              />
            </div>
            <div className={styles.profileField}>
              <label htmlFor="phone_number">전화번호:</label>
              <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleChange}
                  className={styles.editableField}
              />
            </div>
            <div className={styles.profileField}>
              <label htmlFor="password">비밀번호:</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className={styles.editableField}
              />
            </div>
            <button type="submit">수정사항 저장</button>
          </form>
        </div>
      </div>
  );
};

export default ProfileManagementPage;