import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EditViewerModal from '../components/Viewers/EditViewerModal';

// ** 1. ADD THE MISSING EditIcon COMPONENT DEFINITION **
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const ViewersPage = () => {
    const [viewers, setViewers] = useState([]);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedViewer, setSelectedViewer] = useState(null);

    const fetchViewers = async () => {
        try {
            const response = await api.get('/viewers');
            setViewers(response.data);
        } catch (err) {
            console.error("Failed to fetch viewers:", err);
            setError("Could not load the list of viewers.");
        }
    };

    useEffect(() => {
        fetchViewers();
    }, []);

    const handleCreateViewer = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await api.post('/viewers', { name, username, password });
            setMessage(`Viewer "${name}" created successfully!`);
            setName('');
            setUsername('');
            setPassword('');
            fetchViewers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create viewer.');
        }
    };
    
    const handleEditClick = (viewer) => {
        setSelectedViewer(viewer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedViewer(null);
    };

    const handleUpdate = () => {
        fetchViewers();
        handleCloseModal();
    };

    return (
        <div>
            <h1>Manage Viewers</h1>
            
            <div className="card">
                <h3>Create New Viewer</h3>
                <form onSubmit={handleCreateViewer} className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Enter viewer's full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            placeholder="Enter viewer username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter temporary password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" style={{alignSelf: 'flex-end'}}>Create Viewer</button>
                    </div>
                </form>
                {error && <div className="message error" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                {message && <div className="message success" style={{color: 'green', marginTop: '10px'}}>{message}</div>}
            </div>

            <div className="card" style={{marginTop: '20px'}}>
                <h3>Existing Viewers</h3>
                <table className="client-table">
                    <thead>
                        {/* 2. REMOVED WHITESPACE between table rows and headers */}
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
                                        <button onClick={() => handleEditClick(viewer)} title="Edit Viewer">
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
                <EditViewerModal
                    viewer={selectedViewer}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ViewersPage;