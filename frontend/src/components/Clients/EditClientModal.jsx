import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const EditClientModal = ({ client, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...client });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.put(`/clients/${formData._id}`, formData);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes.');
        }
    };

    const handleStatusChange = async (newStatus) => {
        setError('');
        try {
            await api.put(`/clients/${formData._id}/status`, { status: newStatus });
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} client.`);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Client Details</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSaveChanges}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Contact Number</label>
                            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="form-control" />
                        </div>
                        {error && <div className="message error">{error}</div>}
                    </div>
                    <div className="modal-footer">
                        <div className="status-buttons">
                            <button type="button" className="btn btn-success" onClick={() => handleStatusChange('Approved')}>Approve</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleStatusChange('Rejected')}>Reject</button>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;