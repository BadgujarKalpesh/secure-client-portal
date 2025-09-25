import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

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
            setMessage(`Viewer "${username}" created successfully!`);
            setName('');
            setUsername('');
            setPassword('');
            fetchViewers(); // Refresh the list
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
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Created At</th>
                            <th>Actions</th> {/* <-- ADD ACTIONS HEADER */}
                        </tr>
                    </thead>
                    <tbody>
                        {viewers.map(viewer => (
                            <tr key={viewer.id}>
                                <td>{viewer.name}</td>
                                <td>{viewer.username}</td>
                                <td>{new Date(viewer.created_at).toLocaleDateString()}</td>
                                <td>
                                    {/* ADD EDIT BUTTON */}
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

            {/* RENDER THE MODAL when it's open */}
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