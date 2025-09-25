import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const EditClientModal = ({ client, onClose, onUpdate }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    
    // Initialize state with all the detailed fields
    const [formData, setFormData] = useState({
        ...client
    });
    const [error, setError] = useState('');

    const handleStatusChange = async (newStatus) => {
        setError('');
        try {
            await api.put(`/clients/${client.id}/status`, { status: newStatus });
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} client.`);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Client Details: {formData.organisation_name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="modal-body">
                        
                        <h4 className="form-section-header">Section A – Organisation Details</h4>
                        <div className="form-grid">
                            <div className="form-group"><label>Organisation Name</label><input value={formData.organisation_name || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Organisation Address</label><input value={formData.organisation_address || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Organisation Domain ID</label><input value={formData.organisation_domain_id || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Nature of Business</label><input value={formData.nature_of_business || ''} readOnly className="form-control" /></div>
                        </div>

                        <h4 className="form-section-header">Section B – Authorised Signatory</h4>
                        <div className="form-grid">
                            <div className="form-group"><label>Full Name</label><input value={formData.authorised_signatory_full_name || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Mobile Number</label><input value={formData.authorised_signatory_mobile || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Email ID</label><input value={formData.authorised_signatory_email || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Designation</label><input value={formData.authorised_signatory_designation || ''} readOnly className="form-control" /></div>
                        </div>

                        <h4 className="form-section-header">Section C – Billing Contact</h4>
                        <div className="form-grid">
                            <div className="form-group"><label>Billing Contact Name</label><input value={formData.billing_contact_name || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Billing Contact Number</label><input value={formData.billing_contact_number || ''} readOnly className="form-control" /></div>
                            <div className="form-group"><label>Billing Email ID</label><input value={formData.billing_contact_email || ''} readOnly className="form-control" /></div>
                        </div>

                        <h4 className="form-section-header">Documents</h4>
                         <div className="form-grid">
                              <div className="form-group"><label>Organisation Type</label><input value={formData.organisation_type || ''} readOnly className="form-control" /></div>
                              {/* Here you would map over and display links to the documents if they are fetched */}
                         </div>


                        {error && <div className="message error" style={{ color: 'red', marginTop: '15px' }}>{error}</div>}
                    </div>
                    <div className="modal-footer">
                        <div className="status-buttons">
                            <button type="button" className="btn btn-success" onClick={() => handleStatusChange('Approved')}>Approve</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleStatusChange('Rejected')}>Reject</button>
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;