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

    const handleEditClick = (client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleUpdate = () => {
        fetchClients(); // Re-fetch clients to show updated data
        handleCloseModal();
    };

    return (
        <div>
            <h1>Clients</h1>
            <div className="card">
                <ClientsList clients={clients} onEditClick={handleEditClick} />
            </div>
            {isModalOpen && (
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