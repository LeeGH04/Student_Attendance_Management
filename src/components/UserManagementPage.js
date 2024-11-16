import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/UserManagementPage.module.css';
import '../css/Base.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState('');

    // 사용자 목록 가져오기
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/users');
            setUsers(response.data);
        } catch (error) {
            setMessage('사용자 목록을 불러오는데 실패했습니다.');
            console.error('사용자 조회 실패:', error);
        }
    };

    // 사용자 수정
    const handleEditUser = (user) => {
        setEditingUser({ ...user });
    };

    // 사용자 정보 업데이트
    const handleUpdateUser = async () => {
        try {
            await axios.put(`http://localhost:5002/api/users/${editingUser.id}`, editingUser);
            setMessage('사용자 정보가 업데이트되었습니다.');
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            setMessage('사용자 정보 업데이트에 실패했습니다.');
            console.error('사용자 업데이트 실패:', error);
        }
    };

    // 사용자 삭제
    const handleDeleteUser = async (userId) => {
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:5002/api/users/${userId}`);
                setMessage('사용자가 삭제되었습니다.');
                fetchUsers();
            } catch (error) {
                setMessage('사용자 삭제에 실패했습니다.');
                console.error('사용자 삭제 실패:', error);
            }
        }
    };

    // 필터링된 사용자 목록
    const filteredUsers = users.filter(user => {
        const matchesSearch = (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toString().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="main-container">
            <div className="content-container">
                <h1 className="title">사용자 관리</h1>

                {message && (
                    <div className={styles.message}>
                        {message}
                    </div>
                )}

                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="이름, 학번, 이메일로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.roleFilter}>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="student">학생</option>
                            <option value="professor">교수</option>
                            <option value="admin">관리자</option>
                            <option value="parent">학부모</option>
                        </select>
                    </div>
                </div>

                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>학번/교번</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>역할</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className={styles.editButton}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className={styles.deleteButton}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {editingUser && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>사용자 정보 수정</h2>
                            <div className={styles.inputGroup}>
                                <label>이름:</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>이메일:</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        email: e.target.value
                                    })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>전화번호:</label>
                                <input
                                    type="tel"
                                    value={editingUser.phone_number || ''}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        phone_number: e.target.value
                                    })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>역할:</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        role: e.target.value
                                    })}
                                >
                                    <option value="student">학생</option>
                                    <option value="professor">교수</option>
                                    <option value="admin">관리자</option>
                                    <option value="parent">학부모</option>
                                </select>
                            </div>
                            <div className={styles.modalButtons}>
                                <button onClick={handleUpdateUser}>저장</button>
                                <button onClick={() => setEditingUser(null)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;