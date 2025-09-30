import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    if (pageNumbers.length <= 1) return null;
    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const AuditTrailPage = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Show 10 logs per page

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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Audit Trail</h1>
            <div className="card">
                {error && <p className="error-message">{error}</p>}
                <table className="client-table">
                    <thead>
                        <tr>
                            <th style={{width: '20%'}}>Timestamp</th>
                            <th style={{width: '15%'}}>Username</th>
                            <th style={{width: '10%'}}>Role</th>
                            <th style={{width: '20%'}}>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map(log => (
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
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={logs.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

export default AuditTrailPage;