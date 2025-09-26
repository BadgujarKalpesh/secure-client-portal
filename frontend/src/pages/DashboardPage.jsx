import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        clients: { total: 0, approved: 0, rejected: 0 },
        admins: { total: 0 },
        viewers: { total: 0 }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                if (error.response?.status === 403 && error.response?.data?.mfaEnabled === false && (user?.role === 'viewer' || user?.role === 'superAdmin')) {
                    navigate('/settings/mfa', { state: { message: "Please set up MFA to access the portal." } });
                } else {
                    console.error("Failed to fetch stats:", error);
                }
            }
        };
        fetchStats();
    }, [user, navigate]);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="dashboard-stats">
                {user?.role === 'superAdmin' ? (
                    <>
                        <div className="stats-card total">
                            <h2>Total Admins</h2>
                            <div className="count">{stats.admins.total}</div>
                        </div>
                        <div className="stats-card viewers">
                            <h2>Total Viewers</h2>
                            <div className="count">{stats.viewers.total}</div>
                        </div>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;