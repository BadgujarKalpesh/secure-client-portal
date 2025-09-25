import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import ClientsList from '../components/Clients/ClientsList';
import EditClientModal from '../components/Clients/EditClientModal';

const ClientsListPage = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // **FIX**: Fetch full client details when the edit icon is clicked
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