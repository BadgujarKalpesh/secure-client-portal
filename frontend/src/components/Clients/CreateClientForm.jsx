import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const MultiStepForm = ({ onClientAdded }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Section A
        organisationName: '',
        organisationAddress: '',
        organisationDomainId: '',
        natureOfBusiness: '',
        // Section B
        authorisedSignatoryFullName: '',
        authorisedSignatoryMobile: '',
        authorisedSignatoryEmail: '',
        authorisedSignatoryDesignation: '',
        // Section C
        billingContactName: '',
        billingContactNumber: '',
        billingContactEmail: '',
        // Documents
        organisationType: 'Pvt Ltd',
        utilityBillType: 'Electricity Bill',
    });
    const [files, setFiles] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        
        const data = new FormData();
        // Append all text data
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        // Append all file data
        for (const key in files) {
            if (files[key]) {
                data.append(key, files[key]);
            }
        }

        try {
            const response = await api.post('/clients', data);
            if (onClientAdded) {
                onClientAdded(response.data);
            }
            setMessage('Client created successfully!');
            // Reset form logic can be added here
            setStep(1);
            setFormData({ fullName: '', contactNumber: '', email: '', address: '', businessName: '', gstNumber: '', panNumber: '', fssaiCode: '' });
            // setFiles([]);
            e.target.reset();
            setFiles({});
        } catch (err) {
            console.error('Error creating client:', err);
            setError(err.response?.data?.message || 'Error creating client.');
        } finally {
            setIsLoading(false); // **FIX**: Set loading to false in finally block
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3>Section A – Organisation Details</h3>
                        <div className="form-grid">
                            {/* Form fields for Section A */}
                            <div className="form-group"><label>Organisation Name</label><input name="organisationName" value={formData.organisationName} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Organisation Address</label><input name="organisationAddress" value={formData.organisationAddress} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Organisation Domain ID</label><input name="organisationDomainId" value={formData.organisationDomainId} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Nature of Business</label><select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleTextChange} required className="form-control"><option value="">Select...</option><option>Edtech</option><option>Healthcare</option><option>Consumer Durable</option><option>Call Centres</option><option>IT</option><option>Insurance</option><option>Banking</option><option>Finance</option><option>Other</option></select></div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3>Section B – Authorised Signatory</h3>
                        <div className="form-grid">
                            {/* Form fields for Section B */}
                            <div className="form-group"><label>Full Name</label><input name="authorisedSignatoryFullName" value={formData.authorisedSignatoryFullName} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Mobile Number</label><input name="authorisedSignatoryMobile" type="tel" pattern="[0-9]{10}" value={formData.authorisedSignatoryMobile} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Email ID</label><input name="authorisedSignatoryEmail" type="email" value={formData.authorisedSignatoryEmail} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Designation</label><input name="authorisedSignatoryDesignation" value={formData.authorisedSignatoryDesignation} onChange={handleTextChange} required className="form-control" /></div>
                        </div>
                    </>
                );
            case 3:
                return (
                     <>
                        <h3>Section C – Billing Contact</h3>
                        <div className="form-grid">
                           {/* Form fields for Section C */}
                            <div className="form-group"><label>Billing Contact Name</label><input name="billingContactName" value={formData.billingContactName} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Billing Contact Number</label><input name="billingContactNumber" type="tel" pattern="[0-9]{10}" value={formData.billingContactNumber} onChange={handleTextChange} required className="form-control" /></div>
                            <div className="form-group"><label>Billing Email ID</label><input name="billingContactEmail" type="email" value={formData.billingContactEmail} onChange={handleTextChange} required className="form-control" /></div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3>Mandatory Documents</h3>
                        <div className="document-upload-grid">
                            {/* File upload fields */}
                            <div className="form-group"><label>Organisation Type</label><select name="organisationType" value={formData.organisationType} onChange={handleTextChange} className="form-control"><option>Pvt Ltd</option><option>LLP</option><option>Partnership</option><option>Proprietorship</option></select></div>
                            <div className="form-group"><label>Certificate of Incorporation</label><input name="certificateOfIncorporation" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>GST Certificate</label><input name="gstCertificate" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>PAN Card</label><input name="panCard" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Lease Agreement / Office Ownership Proof</label><input name="officeProof" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Utility Bill Type</label><select name="utilityBillType" value={formData.utilityBillType} onChange={handleTextChange} className="form-control"><option>Electricity Bill</option><option>Telephone Bill</option></select></div>
                            <div className="form-group"><label>Utility Bill Document</label><input name="utilityBill" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Authorised Signatory Letter</label><input name="signatoryLetter" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Board Resolution (Optional)</label><input name="boardResolution" type="file" onChange={handleFileChange} className="form-control" /></div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="multi-step-form-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Organisation</div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Signatory</div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Billing</div>
                <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>Documents</div>
            </div>

            {renderStep()}
            
            <div className="form-navigation">
                {step > 1 && <button type="button" className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                {step < 4 && <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>}
                {step === 4 && (
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Create Client'}
                    </button>
                )}bcrypt
            </div>

            {message && <div className="message success" style={{color: 'green', marginTop: '20px'}}>{message}</div>}
            {error && <div className="message error" style={{color: 'red', marginTop: '20px'}}>{error}</div>}
        </form>
    );
};

export default MultiStepForm;