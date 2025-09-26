import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const EditUserModal = ({ user, userType, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        username: user.username || '',
        password: ''
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
        if (!payload.password) {
            delete payload.password;
        }

        try {
            await api.put(`/superadmin/${userType}s/${user.id}`, payload);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to update ${userType}.`);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit {userType.charAt(0).toUpperCase() + userType.slice(1)}: {user.name}</h3>
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

export default EditUserModal;