import React from 'react';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const ClientsList = ({ clients, onEditClick }) => {
    return (
        <>
            <h3>Current Clients</h3>
            {clients.length === 0 ? (
                <p>No clients found.</p>
            ) : (
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th> {/* <-- ADDED HEADER */}
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.customer_id}</td> {/* <-- ADDED DATA CELL */}
                                <td>{client.full_name}</td>
                                <td>{client.email}</td>
                                <td>
                                    <span className={`status-badge status-${client.status}`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-icons">
                                        <button onClick={() => onEditClick(client)} title="Edit Details">
                                            <EditIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default ClientsList;