import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ViewersPage = () => {
    const [viewers, setViewers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
            await api.post('/viewers', { username, password });
            setMessage(`Viewer "${username}" created successfully!`);
            setUsername('');
            setPassword('');
            fetchViewers(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create viewer.');
        }
    };

    return (
        <div>
            <h1>Manage Viewers</h1>
            
            <div className="card">
                <h3>Create New Viewer</h3>
                <form onSubmit={handleCreateViewer} className="form-grid">
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
                {viewers.length > 0 ? (
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewers.map(viewer => (
                                <tr key={viewer.id}>
                                    <td>{viewer.username}</td>
                                    <td>{new Date(viewer.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No viewers have been created yet.</p>
                )}
            </div>
        </div>
    );
};

export default ViewersPage;