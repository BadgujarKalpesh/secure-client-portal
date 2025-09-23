import React from 'react';

const ClientList = ({ clients }) => {
    return (
        <div style={{ padding: '20px', border: '1px solid #eee' }}>
            <h3>Current Clients</h3>
            {clients.length === 0 ? (
                <p>No clients found. Add one using the form.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Full Name</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Contact Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px' }}>{client.fullName}</td>
                                <td style={{ padding: '8px' }}>{client.email}</td>
                                <td style={{ padding: '8px' }}>{client.contactNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientList;