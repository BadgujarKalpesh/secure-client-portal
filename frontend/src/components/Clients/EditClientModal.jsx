import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const EditClientModal = ({ client, onClose, onUpdate }) => {
    const { user } = useAuth(); // Get the current user
    const isAdmin = user?.role === 'admin'; // Check if the user is an admin\

    const [formData, setFormData] = useState({ ...client });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        if (!isAdmin) return; // Prevent changes if not admin
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Create a payload with camelCase keys that the backend expects
            const payload = {
                fullName: formData.full_name,
                contactNumber: formData.contact_number,
                email: formData.email,
                address: formData.address,
                businessName: formData.business_name,
                gstNumber: formData.gst_number,
                panNumber: formData.pan_number,
                fssaiCode: formData.fssai_code,
            };
            await api.put(`/clients/${formData.id}`, payload);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes.');
        }
    };

    const handleStatusChange = async (newStatus) => {
        setError('');
        try {
            await api.put(`/clients/${formData.id}/status`, { status: newStatus });
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} client.`);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isAdmin ? 'Edit Client' : 'View Client'}: {formData.full_name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                {/* Prevent form submission if not an admin */}
                <form onSubmit={isAdmin ? handleSaveChanges : (e) => e.preventDefault()}>
                    <div className="modal-body">
                        {/* Section for Basic Info */}
                        {/* <h4 className="form-section-header">Basic Information</h4> */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                            </div>
                        </div>

                        {/* Section for Business Info */}
                        <h4 className="form-section-header">Business Information</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>GST Number</label>
                                <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>PAN Number</label>
                                <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} className="form-control" />
                            </div>
                             <div className="form-group">
                                <label>FSSAI Code</label>
                                <input type="text" name="fssai_code" value={formData.fssai_code} onChange={handleChange} className="form-control" />
                            </div>
                        </div>

                        {error && <div className="message error" style={{ color: 'red', marginTop: '15px' }}>{error}</div>}
                    </div>
                    <div className="modal-footer">
                        {/* Only show action buttons to admins */}
                        {isAdmin && (
                            <>
                                <div className="status-buttons">
                                    <button type="button" className="btn btn-success" onClick={() => handleStatusChange('Approved')}>Approve</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleStatusChange('Rejected')}>Reject</button>
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </>
                        )}
                        {!isAdmin && (
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;