import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import CreateClientForm from '../components/Clients/CreateClientForm';
import ClientList from '../components/Clients/ClientsList';
import MfaSetup from '../components/Auth/MfaSetup';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [clients, setClients] = useState([]);

    const fetchClients = useCallback(async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h1>Admin Dashboard</h1>
                <div>
                    <span style={{ marginRight: '15px' }}>Welcome, {user?.username || 'Admin'}!</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>
            
            <main style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                <div style={{ flex: 2 }}>
                    <ClientList clients={clients} />
                </div>
                <div style={{ flex: 1 }}>
                    <CreateClientForm onClientCreated={fetchClients} />
                    <MfaSetup />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;