import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuditTrailPage = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/audit-logs');
                setLogs(response.data);
            } catch {
                setError('Failed to load audit trail.');
            }
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h1>Audit Trail</h1>
            <div className="card">
                {error && <p className="error-message">{error}</p>}
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.created_at).toLocaleString()}</td>
                                <td>{log.username}</td>
                                <td>{log.user_role}</td>
                                <td>{log.action}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditTrailPage;