// frontend/src/components/CreateClientForm.jsx

import React, { useState } from 'react';
import api from '../../api/axiosConfig'; // Your pre-configured axios instance

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

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We must use FormData to send files
    const data = new FormData();

    // Append all text fields
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // Append all files
    for (let i = 0; i < files.length; i++) {
        // The key 'documents' MUST match the backend route's middleware name
        data.append('documents', files[i]);
    }

    try {
      const response = await api.post('/clients', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onClientAdded(response.data);
      // Reset form or give success message
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Basic Information */}
      <input name="fullName" value={formData.fullName} onChange={handleTextChange} placeholder="Full Name" required />
      <input name="contactNumber" value={formData.contactNumber} onChange={handleTextChange} placeholder="Contact Number" required />
      <input name="email" type="email" value={formData.email} onChange={handleTextChange} placeholder="Email ID" required />
      <input name="address" value={formData.address} onChange={handleTextChange} placeholder="Address" />
      
      {/* Business Information */}
      <input name="businessName" value={formData.businessName} onChange={handleTextChange} placeholder="Business Name" />
      <input name="gstNumber" value={formData.gstNumber} onChange={handleTextChange} placeholder="GST Number" />
      <input name="panNumber" value={formData.panNumber} onChange={handleTextChange} placeholder="PAN Number" />

      {/* Other Details */}
      <input name="fssaiCode" value={formData.fssaiCode} onChange={handleTextChange} placeholder="FSSAI Code" />

      {/* File Upload */}
      <div>
        <label>KYC Documents (PDF, JPG, PNG)</label>
        <input type="file" onChange={handleFileChange} multiple />
      </div>

      <button type="submit">Create Client</button>
    </form>
  );
}

export default CreateClientForm;