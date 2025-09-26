import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import ClientsList from '../components/Clients/ClientsList';
import EditClientModal from '../components/Clients/EditClientModal';

const ClientsListPage = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchClients = useCallback(async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            if (error.response?.status === 403 && error.response?.data?.mfaEnabled === false) {
                const role = user?.role;
                const message = "Please set up MFA to access this feature.";
                if (role === 'admin') {
                    navigate('/settings/mfa', { state: { message } });
                } else if (role === 'viewer') {
                    navigate('/settings/viewer-mfa', { state: { message } });
                }
            } else {
                console.error("Failed to fetch clients:", error);
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleEditClick = async (client) => {
        try {
            const response = await api.get(`/clients/${client.id}`);
            setSelectedClient(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch client details:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleUpdate = () => {
        fetchClients();
        handleCloseModal();
    };

    return (
        <div>
            <h1>Clients</h1>
            <div className="card">
                <ClientsList clients={clients} onEditClick={handleEditClick} />
            </div>
            {isModalOpen && selectedClient && (
                <EditClientModal
                    client={selectedClient}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ClientsListPage;