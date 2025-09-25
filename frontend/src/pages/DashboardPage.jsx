import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        clients: { total: 0, approved: 0, rejected: 0 },
        viewers: { total: 0 }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch from the new dedicated stats endpoint
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="dashboard-stats">
                <div className="stats-card total">
                    <h2>Total Clients</h2>
                    <div className="count">{stats.clients.total}</div>
                </div>
                <div className="stats-card approved">
                    <h2>Approved Clients</h2>
                    <div className="count">{stats.clients.approved}</div>
                </div>
                <div className="stats-card rejected">
                    <h2>Rejected Clients</h2>
                    <div className="count">{stats.clients.rejected}</div>
                </div>
                <div className="stats-card viewers">
                    <h2>Total Viewers</h2>
                    <div className="count">{stats.viewers.total}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;