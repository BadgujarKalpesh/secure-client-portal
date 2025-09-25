import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const DashboardPage = () => {
    const { user } = useAuth(); // Get the user object
    const [stats, setStats] = useState({
        clients: { total: 0, approved: 0, rejected: 0 },
        viewers: { total: 0 }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
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

                {/* **FIX**: Only show the viewers card if the user is an admin */}
                {user?.role === 'admin' && (
                    <div className="stats-card viewers">
                        <h2>Total Viewers</h2>
                        <div className="count">{stats.viewers.total}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;