import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const PdfViewerModal = ({ fileUrl, onClose }) => {
    if (!fileUrl) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>PDF Preview</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body" style={{ height: '70vh' }}>
                    <iframe src={fileUrl} width="100%" height="100%" title="PDF Preview" style={{ border: 'none' }} />
                </div>
            </div>
        </div>
    );
};

const EditClientModal = ({ client, onClose, onUpdate }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    
    const [formData, setFormData] = useState({ ...client });
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get(`/clients/${client.id}/documents`);
                setDocuments(response.data);
            } catch (err) {
                console.error("Failed to fetch documents:", err);
            }
        };
        fetchDocuments();
    }, [client.id]);

    const handleViewPdf = async (url) => {
        try {
            // Fetch the PDF from the URL
            const response = await fetch(url);
            // Create a blob from the response
            const blob = await response.blob();
            // Create an object URL from the blob
            const objectUrl = URL.createObjectURL(blob);
            setPdfPreviewUrl(objectUrl);
        } catch (err) {
            console.error("Error fetching PDF for preview:", err);
            setError("Could not load the PDF for preview.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setError('');
        setMessage('');
        try {
            await api.put(`/clients/${client.id}`, formData);
            setMessage('Client details updated successfully!');
            setTimeout(() => onUpdate(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update client details.');
        }
    };

    const handleStatusChange = async (newStatus) => {
        setError('');
        setMessage('');
        try {
            await api.put(`/clients/${client.id}/status`, { status: newStatus });
            setMessage(`Client status changed to ${newStatus}.`);
            setTimeout(() => onUpdate(), 1500);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} client.`);
        }
    };

    return (
        <>
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
                                <div className="form-group"><label>Organisation Name</label><input name="organisation_name" value={formData.organisation_name || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Organisation Address</label><input name="organisation_address" value={formData.organisation_address || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Organisation Domain ID</label><input name="organisation_domain_id" value={formData.organisation_domain_id || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Nature of Business</label><input name="nature_of_business" value={formData.nature_of_business || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                            </div>

                            <h4 className="form-section-header">Section B – Authorised Signatory</h4>
                            <div className="form-grid">
                                <div className="form-group"><label>Full Name</label><input name="authorised_signatory_full_name" value={formData.authorised_signatory_full_name || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Mobile Number</label><input name="authorised_signatory_mobile" value={formData.authorised_signatory_mobile || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Email ID</label><input name="authorised_signatory_email" value={formData.authorised_signatory_email || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Designation</label><input name="authorised_signatory_designation" value={formData.authorised_signatory_designation || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                            </div>

                            <h4 className="form-section-header">Section C – Billing Contact</h4>
                            <div className="form-grid">
                                <div className="form-group"><label>Billing Contact Name</label><input name="billing_contact_name" value={formData.billing_contact_name || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Billing Contact Number</label><input name="billing_contact_number" value={formData.billing_contact_number || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                                <div className="form-group"><label>Billing Email ID</label><input name="billing_contact_email" value={formData.billing_contact_email || ''} onChange={handleChange} readOnly={!isAdmin} className="form-control" /></div>
                            </div>

                            <h4 className="form-section-header">Documents</h4>
                            <div className="preview-section" style={{ gridColumn: '1 / -1' }}>
                                {documents.length > 0 ? (
                                    documents.map(doc => (
                                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span>{doc.document_type.replace(/([A-Z])/g, ' $1').trim()}: {doc.document_unique_id}</span>
                                            <button type="button" className="btn btn-secondary" onClick={() => handleViewPdf(doc.url)}>View PDF</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No documents found for this client.</p>
                                )}
                            </div>

                            {error && <div className="message error" style={{ color: 'red', marginTop: '15px' }}>{error}</div>}
                            {message && <div className="message success" style={{ color: 'green', marginTop: '15px' }}>{message}</div>}
                        </div>
                        <div className="modal-footer">
                            <div className="status-buttons">
                                <button type="button" className="btn btn-success" onClick={() => handleStatusChange('Approved')}>Approve</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleStatusChange('Rejected')}>Reject</button>
                            </div>
                            <div>
                                {isAdmin && <button type="button" className="btn btn-primary" onClick={handleSaveChanges} style={{ marginRight: '10px' }}>Save Changes</button>}
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {pdfPreviewUrl && <PdfViewerModal fileUrl={pdfPreviewUrl} onClose={() => setPdfPreviewUrl(null)} />}
        </>
    );
};

export default EditClientModal;