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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showParentLinkModal, setShowParentLinkModal] = useState(false);
    const [newUser, setNewUser] = useState({
        id: '',
        name: '',
        password: '',
        email: '',
        phone_number: '',
        role: 'student'
    });
    const [parentLinkData, setParentLinkData] = useState({
        studentId: '',
        parentId: ''
    });
    const [availableStudents, setAvailableStudents] = useState([]);
    const [availableParents, setAvailableParents] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/users');
            setUsers(response.data);

            // 학생과 부모 목록 필터링
            setAvailableStudents(response.data.filter(user => user.role === 'student'));
            setAvailableParents(response.data.filter(user => user.role === 'parent'));
        } catch (error) {
            setMessage('사용자 목록을 불러오는데 실패했습니다.');
            console.error('사용자 조회 실패:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            if (!newUser.id || !newUser.name || !newUser.password) {
                setMessage('필수 정보를 모두 입력해주세요.');
                return;
            }

            await axios.post('http://localhost:5002/api/users', newUser);
            setMessage('사용자가 생성되었습니다.');
            setShowCreateModal(false);
            setNewUser({
                id: '',
                name: '',
                password: '',
                email: '',
                phone_number: '',
                role: 'student'
            });
            fetchUsers();
        } catch (error) {
            setMessage('사용자 생성에 실패했습니다.');
            console.error('사용자 생성 실패:', error);
        }
    };

    const handleLinkParentStudent = async () => {
        try {
            if (!parentLinkData.studentId || !parentLinkData.parentId) {
                setMessage('학생과 부모를 모두 선택해주세요.');
                return;
            }

            await axios.post('http://localhost:5002/api/parent-child', parentLinkData);
            setMessage('학생과 부모가 연결되었습니다.');
            setShowParentLinkModal(false);
            setParentLinkData({
                studentId: '',
                parentId: ''
            });
        } catch (error) {
            setMessage('학생-부모 연결에 실패했습니다.');
            console.error('학생-부모 연결 실패:', error);
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
                <div className={styles.header}>
                    <h1 className="title">사용자 관리</h1>
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.createButton}
                            onClick={() => setShowCreateModal(true)}
                        >
                            새 사용자 생성
                        </button>
                        <button
                            className={styles.linkButton}
                            onClick={() => setShowParentLinkModal(true)}
                        >
                            학생-부모 연결
                        </button>
                    </div>
                </div>

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
                {showCreateModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>새 사용자 생성</h2>
                            <div className={styles.inputGroup}>
                                <label>학번/교번:</label>
                                <input
                                    type="text"
                                    value={newUser.id}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
                                        id: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>이름:</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
                                        name: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>비밀번호:</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
                                        password: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>이메일:</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
                                        email: e.target.value
                                    })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>전화번호:</label>
                                <input
                                    type="tel"
                                    value={newUser.phone_number}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
                                        phone_number: e.target.value
                                    })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>역할:</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({
                                        ...newUser,
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
                                <button onClick={handleCreateUser}>생성</button>
                                <button onClick={() => setShowCreateModal(false)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
                {showParentLinkModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>학생-부모 연결</h2>
                            <div className={styles.inputGroup}>
                                <label>학생:</label>
                                <select
                                    value={parentLinkData.studentId}
                                    onChange={(e) => setParentLinkData({
                                        ...parentLinkData,
                                        studentId: e.target.value
                                    })}
                                >
                                    <option value="">학생 선택</option>
                                    {availableStudents.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>학부모:</label>
                                <select
                                    value={parentLinkData.parentId}
                                    onChange={(e) => setParentLinkData({
                                        ...parentLinkData,
                                        parentId: e.target.value
                                    })}
                                >
                                    <option value="">학부모 선택</option>
                                    {availableParents.map(parent => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name} ({parent.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.modalButtons}>
                                <button onClick={handleLinkParentStudent}>연결</button>
                                <button onClick={() => setShowParentLinkModal(false)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
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