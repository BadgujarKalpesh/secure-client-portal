import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import EditUserModal from '../components/SuperAdmin/EditUserModal';
import CreateUserModal from '../components/SuperAdmin/CreateUserModal';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const ManageUsersPage = () => {
    const [admins, setAdmins] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userType, setUserType] = useState('admin');

    const fetchUsers = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEditClick = (user, type) => {
        setSelectedUser(user);
        setUserType(type);
        setIsEditModalOpen(true);
    };

    const handleCreateClick = (type) => {
        setUserType(type);
        setIsCreateModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedUser(null);
    };

    const handleUpdate = () => {
        fetchUsers();
        handleCloseModals();
    };

    const toggleButtonStyle = (selectedRole) => ({
        padding: '10px 20px',
        width: '50%',
        border: 'none',
        background: userType === selectedRole ? 'var(--primary-blue)' : '#f0f0f0',
        color: userType === selectedRole ? 'white' : 'black',
        cursor: 'pointer',
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manage Users</h1>
                <div>
                    <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => handleCreateClick('admin')}>Create Admin</button>
                    <button className="btn btn-primary" onClick={() => handleCreateClick('viewer')}>Create Viewer</button>
                </div>
            </div>

            {error && <div className="message error">{error}</div>}

            <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                    <button style={toggleButtonStyle('admin')} onClick={() => setUserType('admin')}>Admins</button>
                    <button style={toggleButtonStyle('viewer')} onClick={() => setUserType('viewer')}>Viewers</button>
                </div>

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
                        {(userType === 'admin' ? admins : viewers).map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEditClick(user, userType)} title={`Edit ${userType}`}>
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && (
                <EditUserModal
                    user={selectedUser}
                    userType={userType}
                    onClose={handleCloseModals}
                    onUpdate={handleUpdate}
                />
            )}
            
            {isCreateModalOpen && (
                <CreateUserModal
                    userType={userType}
                    onClose={handleCloseModals}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ManageUsersPage;