import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EditUserModal from '../components/SuperAdmin/EditUserModal';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const UserListPage = () => {
    const [admins, setAdmins] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userType, setUserType] = useState('');

    const fetchUsers = async () => {
        try {
            const [adminsRes, viewersRes] = await Promise.all([
                api.get('/superadmin/admins'),
                api.get('/superadmin/viewers')
            ]);
            setAdmins(adminsRes.data);
            setViewers(viewersRes.data);
        } catch {
            setError('Could not load user lists.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user, type) => {
        setSelectedUser(user);
        setUserType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setUserType('');
    };

    const handleUpdate = () => {
        fetchUsers();
        handleCloseModal();
    };

    return (
        <div>
            <h1>User Lists</h1>
            {error && <div className="message error">{error}</div>}

            <div className="card">
                <h3>Admins</h3>
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.name}</td>
                                <td>{admin.username}</td>
                                <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-icons">
                                        <button onClick={() => handleEditClick(admin, 'admin')} title="Edit Admin">
                                            <EditIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Viewers</h3>
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewers.map(viewer => (
                            <tr key={viewer.id}>
                                <td>{viewer.name}</td>
                                <td>{viewer.username}</td>
                                <td>{new Date(viewer.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-icons">
                                        <button onClick={() => handleEditClick(viewer, 'viewer')} title="Edit Viewer">
                                            <EditIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <EditUserModal
                    user={selectedUser}
                    userType={userType}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default UserListPage;