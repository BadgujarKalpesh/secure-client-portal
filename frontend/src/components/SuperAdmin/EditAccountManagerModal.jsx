import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const EditAccountManagerModal = ({ manager, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: manager.name || '',
        email: manager.email || '',
        contact_number: manager.contact_number || '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.put(`/account-managers/${manager.id}`, formData);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update account manager.');
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Account Manager: {manager.name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSaveChanges}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="form-control" />
                        </div>
                        {error && <div className="message error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAccountManagerModal;