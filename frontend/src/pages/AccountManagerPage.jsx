import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EditAccountManagerModal from '../components/SuperAdmin/EditAccountManagerModal';
import CreateAccountManagerModal from '../components/SuperAdmin/CreateAccountManagerModal';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    if (pageNumbers.length <= 1) return null; // Don't show pagination if there's only one page
    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const AccountManagerPage = () => {
    const [accountManagers, setAccountManagers] = useState([]);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAccountManagers = async () => {
        try {
            const response = await api.get('/account-managers');
            setAccountManagers(response.data);
        } catch{
            setError('Could not load account managers.');
        }
    };

    useEffect(() => {
        fetchAccountManagers();
    }, []);

    const handleEditClick = (manager) => {
        setSelectedManager(manager);
        setIsEditModalOpen(true);
    };
    
    const handleCloseModals = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedManager(null);
    };

    const handleUpdate = () => {
        fetchAccountManagers();
        handleCloseModals();
    };
    
    // Filter managers based on search term
    const filteredManagers = accountManagers.filter(manager =>
        manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredManagers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Manage Account Managers</h1>
                <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>Create New Manager</button>
            </div>
            
            <div className="card">
                <div className="toolbar">
                    <input 
                        type="text"
                        placeholder="Search by name..."
                        className="form-control"
                        style={{ width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(manager => (
                            <tr key={manager.id}>
                                <td>{manager.name}</td>
                                <td>{manager.email}</td>
                                <td>{manager.contact_number}</td>
                                <td>
                                    <button onClick={() => handleEditClick(manager)} title="Edit Manager" className="action-button">
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination 
                    itemsPerPage={itemsPerPage} 
                    totalItems={filteredManagers.length} 
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>

            {isEditModalOpen && (
                <EditAccountManagerModal
                    manager={selectedManager}
                    onClose={handleCloseModals}
                    onUpdate={handleUpdate}
                />
            )}
            
            {isCreateModalOpen && (
                <CreateAccountManagerModal
                    onClose={handleCloseModals}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default AccountManagerPage;