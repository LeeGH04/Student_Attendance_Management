import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from '../css/LoginPage.module.css';
import loginImage from '../images/loginp.png';
import '../css/Base.css';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("보내는 데이터:", {id, password});

        try {
            const response = await axios.post('http://localhost:5002/login', {
                id: id,
                password: password,
            });

            if (response.status === 200) {
                const {message, role, token} = response.data;
                console.log('로그인 성공:', message);
                console.log('받은 토큰:', token);

                localStorage.setItem('authToken', token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', role);

                const savedToken = localStorage.getItem('authToken');
                console.log('저장된 토큰:', savedToken);

                if (role === 'student') {
                    navigate('/student-main');
                } else if (role === 'professor') {
                    navigate('/professor-main');
                } else if (role === 'admin') {
                    navigate('/admin-main');
                } else if (role === 'parent') {
                    navigate('/parent-main');
                }
            } else {
                setError('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            if (error.response) {
                console.log('서버 오류:', error.response);
                if (error.response.status === 401) {
                    setError('잘못된 학번 또는 비밀번호입니다.');
                } else {
                    setError(`서버 오류: ${error.response.data.message}`);
                }
            } else if (error.request) {
                console.log('요청 오류:', error.request);
                setError('서버와 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.');
            } else {
                console.log('오류:', error.message);
                setError('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className={styles.screen}>
            <div className={styles.loginContainer}>
                <div className={styles.loginIconSection}>
                    <img src={loginImage} alt="login icon"/>
                </div>
                <div className={styles.loginFormSection}>
                    <div className={styles.textWrapper}>로그인</div>
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>학번</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="학번을 입력하세요"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>비밀번호</label>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div>{error}</div>}
                        <button type="submit" >
                            로그인
                        </button>
                    </form>
                    <div
                        style={{cursor: 'pointer'}}
                    >
                        비밀번호 찾기
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;