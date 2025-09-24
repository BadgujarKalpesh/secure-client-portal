// frontend/src/components/Clients/CreateClientForm.jsx

import React, { useState } from 'react';
import api from '../../api/axiosConfig';

function CreateClientForm({ onClientAdded }) {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
    businessName: '',
    gstNumber: '',
    panNumber: '',
    fssaiCode: ''
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    for (let i = 0; i < files.length; i++) {
      data.append('documents', files[i]);
    }

    api.post('/clients', data)
    .then(response => {
      if (onClientAdded) {
        onClientAdded(response.data);
      }
      setMessage('Client created successfully!');
      setFormData({ fullName: '', contactNumber: '', email: '', address: '', businessName: '', gstNumber: '', panNumber: '', fssaiCode: '' });
      setFiles([]);
      e.target.reset();
    })
    .catch(error => {
      console.error('Error creating client:', error);
      setMessage('Error creating client. Please check the console.');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
        <h3>Basic Information</h3>
        <div className="form-grid">
            <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleTextChange} placeholder="Full Name" required className="form-control" />
            </div>
            <div className="form-group">
                <label>Contact Number</label>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleTextChange} placeholder="Contact Number" required className="form-control" />
            </div>
            <div className="form-group">
                <label>Email ID</label>
                <input name="email" type="email" value={formData.email} onChange={handleTextChange} placeholder="Email ID" required className="form-control" />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleTextChange} placeholder="Address" className="form-control" />
            </div>
        </div>
        
        <h3>Business Information</h3>
        <div className="form-grid">
            <div className="form-group">
                <label>Business Name</label>
                <input name="businessName" value={formData.businessName} onChange={handleTextChange} placeholder="Business Name" className="form-control" />
            </div>
            <div className="form-group">
                <label>GST Number</label>
                <input name="gstNumber" value={formData.gstNumber} onChange={handleTextChange} placeholder="GST Number" className="form-control" />
            </div>
            <div className="form-group">
                <label>PAN Number</label>
                <input name="panNumber" value={formData.panNumber} onChange={handleTextChange} placeholder="PAN Number" className="form-control" />
            </div>
        </div>

        <h3>Other Details</h3>
        <div className="form-grid">
            <div className="form-group">
                <label>FSSAI Code</label>
                <input name="fssaiCode" value={formData.fssaiCode} onChange={handleTextChange} placeholder="FSSAI Code" className="form-control" />
            </div>
        </div>

        <div className="form-group">
            <label>KYC Documents (PDF, JPG, PNG)</label>
            <input type="file" onChange={handleFileChange} multiple className="form-control" />
        </div>

        {message && <div className="message success">{message}</div>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Create Client</button>
    </form>
  );
}

export default CreateClientForm;