import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const PdfViewerModal = ({ file, onClose }) => {
    if (!file) return null;

    const fileUrl = URL.createObjectURL(file);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>PDF Preview: {file.name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body" style={{ height: '70vh' }}>
                    <iframe src={fileUrl} width="100%" height="100%" title={file.name} />
                </div>
            </div>
        </div>
    );
};

const MultiStepForm = ({ onClientAdded }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        organisationName: '',
        organisationAddress: '',
        organisationDomainId: '',
        natureOfBusiness: '',
        authorisedSignatoryFullName: '',
        authorisedSignatoryMobile: '',
        authorisedSignatoryEmail: '',
        authorisedSignatoryDesignation: '',
        billingContactName: '',
        billingContactNumber: '',
        billingContactEmail: '',
        organisationType: 'Pvt Ltd',
        utilityBillType: 'Electricity Bill',
    });
    const [files, setFiles] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(null);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const nextStep = () => {
        // Form validation before proceeding to the next step
        const currentFields = Object.keys(formData).filter(key => {
            if (step === 1) return ['organisationName', 'organisationAddress', 'organisationDomainId', 'natureOfBusiness'].includes(key);
            if (step === 2) return ['authorisedSignatoryFullName', 'authorisedSignatoryMobile', 'authorisedSignatoryEmail', 'authorisedSignatoryDesignation'].includes(key);
            if (step === 3) return ['billingContactName', 'billingContactNumber', 'billingContactEmail'].includes(key);
            return false;
        });

        const isStepValid = currentFields.every(field => formData[field].trim() !== '');
        
        if (!isStepValid) {
            setError('Please fill out all mandatory fields.');
            return;
        }

        setError('');
        setStep(step + 1);
    };
    
    const prevStep = () => setStep(step - 1);

    const handleViewPdf = (fileName) => {
        setPdfPreview(files[fileName]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        for (const key in files) {
            if (files[key]) {
                data.append(key, files[key]);
            }
        }

        try {
            await api.post('/clients', data);
            setMessage('Client created successfully!');
            setTimeout(() => {
                setStep(1);
                setFormData({ organisationName: '', organisationAddress: '', organisationDomainId: '', natureOfBusiness: '', authorisedSignatoryFullName: '', authorisedSignatoryMobile: '', authorisedSignatoryEmail: '', authorisedSignatoryDesignation: '', billingContactName: '', billingContactNumber: '', billingContactEmail: '', organisationType: 'Pvt Ltd', utilityBillType: 'Electricity Bill' });
                setFiles({});
                setMessage('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating client.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3>Section A – Organisation Details</h3>
                        <div className="form-grid">
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
                            <div className="form-group"><label>Organisation Type</label><select name="organisationType" value={formData.organisationType} onChange={handleTextChange} required className="form-control"><option>Pvt Ltd</option><option>LLP</option><option>Partnership</option><option>Proprietorship</option></select></div>
                            <div className="form-group"><label>Certificate of Incorporation</label><input name="certificateOfIncorporation" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>GST Certificate</label><input name="gstCertificate" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>PAN Card</label><input name="panCard" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Lease Agreement / Office Ownership Proof</label><input name="officeProof" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Utility Bill Type</label><select name="utilityBillType" value={formData.utilityBillType} onChange={handleTextChange} required className="form-control"><option>Electricity Bill</option><option>Telephone Bill</option></select></div>
                            <div className="form-group"><label>Utility Bill Document</label><input name="utilityBill" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Authorised Signatory Letter</label><input name="signatoryLetter" type="file" onChange={handleFileChange} required className="form-control" /></div>
                            <div className="form-group"><label>Board Resolution (Optional)</label><input name="boardResolution" type="file" onChange={handleFileChange} className="form-control" /></div>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <h3>Preview Details</h3>
                        <div className="preview-grid">
                            <div className="preview-section">
                                <h4>Organisation Details</h4>
                                <p><strong>Name:</strong> {formData.organisationName}</p>
                                <p><strong>Address:</strong> {formData.organisationAddress}</p>
                                <p><strong>Domain ID:</strong> {formData.organisationDomainId}</p>
                                <p><strong>Nature of Business:</strong> {formData.natureOfBusiness}</p>
                            </div>
                            <div className="preview-section">
                                <h4>Authorised Signatory</h4>
                                <p><strong>Full Name:</strong> {formData.authorisedSignatoryFullName}</p>
                                <p><strong>Mobile:</strong> {formData.authorisedSignatoryMobile}</p>
                                <p><strong>Email:</strong> {formData.authorisedSignatoryEmail}</p>
                                <p><strong>Designation:</strong> {formData.authorisedSignatoryDesignation}</p>
                            </div>
                            <div className="preview-section">
                                <h4>Billing Contact</h4>
                                <p><strong>Name:</strong> {formData.billingContactName}</p>
                                <p><strong>Number:</strong> {formData.billingContactNumber}</p>
                                <p><strong>Email:</strong> {formData.billingContactEmail}</p>
                            </div>
                            <div className="preview-section">
                                <h4>Documents</h4>
                                {Object.entries(files).map(([key, file]) => (
                                    file && <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}: {file.name}</span>
                                        <button type="button" className="btn btn-secondary" onClick={() => handleViewPdf(key)}>View PDF</button>
                                    </div>
                                ))}
                            </div>
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
                <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>Preview</div>
            </div>

            {renderStep()}
            
            <div className="form-navigation">
                {step > 1 && <button type="button" className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                {step < 5 && <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>}
                {step === 5 && (
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Client Details'}
                    </button>
                )}
            </div>

            {message && <div className="message success" style={{color: 'green', marginTop: '20px'}}>{message}</div>}
            {error && <div className="message error" style={{color: 'red', marginTop: '20px'}}>{error}</div>}
            
            {pdfPreview && <PdfViewerModal file={pdfPreview} onClose={() => setPdfPreview(null)} />}
        </form>
    );
};

export default MultiStepForm;