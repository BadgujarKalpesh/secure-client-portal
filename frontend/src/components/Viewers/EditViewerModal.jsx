import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const EditViewerModal = ({ viewer, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: viewer.name || '',
        username: viewer.username || '',
        password: '' // Password is blank by default for security
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setError('');

        const payload = { ...formData };
        // If the password field is empty, don't include it in the request
        if (!payload.password) {
            delete payload.password;
        }

        try {
            await api.put(`/viewers/${viewer.id}`, payload);
            onUpdate(); // This will re-fetch the viewers list and close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update viewer.');
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Viewer: {viewer.name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSaveChanges}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>New Password (optional)</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Leave blank to keep current password" />
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

export default EditViewerModal;