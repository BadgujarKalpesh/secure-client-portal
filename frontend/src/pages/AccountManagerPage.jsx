import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EditAccountManagerModal from '../components/SuperAdmin/EditAccountManagerModal';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const AccountManagerPage = () => {
    const [accountManagers, setAccountManagers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);

    const fetchAccountManagers = async () => {
        try {
            const response = await api.get('/account-managers');
            setAccountManagers(response.data);
        } catch {
            setError('Could not load account managers.');
        }
    };

    useEffect(() => {
        fetchAccountManagers();
    }, []);

    const handleCreateManager = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post('/account-managers', { name, email, contactNumber });
            setMessage(`Account Manager "${name}" created successfully!`);
            setName('');
            setEmail('');
            setContactNumber('');
            fetchAccountManagers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account manager.');
        }
    };

    const handleEditClick = (manager) => {
        setSelectedManager(manager);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedManager(null);
    };

    const handleUpdate = () => {
        fetchAccountManagers();
        handleCloseModal();
    };

    return (
        <div>
            <h1>Manage Account Managers</h1>
            
            <div className="card">
                <h3>Create New Account Manager</h3>
                <form onSubmit={handleCreateManager} className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" style={{alignSelf: 'flex-end'}}>Create Manager</button>
                    </div>
                </form>
                {error && <div className="message error" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                {message && <div className="message success" style={{color: 'green', marginTop: '10px'}}>{message}</div>}
            </div>

            <div className="card" style={{marginTop: '20px'}}>
                <h3>Existing Account Managers</h3>
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountManagers.map(manager => (
                            <tr key={manager.id}>
                                <td>{manager.name}</td>
                                <td>{manager.email}</td>
                                <td>{manager.contact_number}</td>
                                <td>
                                    <button onClick={() => handleEditClick(manager)} title="Edit Manager">
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <EditAccountManagerModal
                    manager={selectedManager}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default AccountManagerPage;