import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const DashboardPage = () => {
    const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients');
                const clients = response.data;
                const approved = clients.filter(c => c.status === 'Approved').length;
                const rejected = clients.filter(c => c.status === 'Rejected').length;
                setStats({ total: clients.length, approved, rejected });
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            }
        };
        fetchClients();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="dashboard-stats">
                <div className="stats-card total">
                    <h2>Total Clients</h2>
                    <div className="count">{stats.total}</div>
                </div>
                <div className="stats-card approved">
                    <h2>Approved Clients</h2>
                    <div className="count">{stats.approved}</div>
                </div>
                <div className="stats-card rejected">
                    <h2>Rejected Clients</h2>
                    <div className="count">{stats.rejected}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;