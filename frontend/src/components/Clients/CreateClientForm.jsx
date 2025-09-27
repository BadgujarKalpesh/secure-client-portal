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
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(null);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const validateStep = () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.organisationName) newErrors.organisationName = "Organisation Name is required.";
            if (!formData.organisationAddress) newErrors.organisationAddress = "Organisation Address is required.";
            if (!formData.organisationDomainId) newErrors.organisationDomainId = "Organisation Domain ID is required.";
            if (!formData.natureOfBusiness) newErrors.natureOfBusiness = "Nature of Business is required.";
        } else if (step === 2) {
            if (!formData.authorisedSignatoryFullName) newErrors.authorisedSignatoryFullName = "Full Name is required.";
            if (!formData.authorisedSignatoryMobile) newErrors.authorisedSignatoryMobile = "Mobile Number is required.";
            if (!formData.authorisedSignatoryEmail) newErrors.authorisedSignatoryEmail = "Email ID is required.";
            if (!formData.authorisedSignatoryDesignation) newErrors.authorisedSignatoryDesignation = "Designation is required.";
        } else if (step === 3) {
            if (!formData.billingContactName) newErrors.billingContactName = "Billing Contact Name is required.";
            if (!formData.billingContactNumber) newErrors.billingContactNumber = "Billing Contact Number is required.";
            if (!formData.billingContactEmail) newErrors.billingContactEmail = "Billing Email ID is required.";
        } else if (step === 4) {
            if (!files.certificateOfIncorporation) newErrors.certificateOfIncorporation = "Certificate of Incorporation is required.";
            if (!files.gstCertificate) newErrors.gstCertificate = "GST Certificate is required.";
            if (!files.panCard) newErrors.panCard = "PAN Card is required.";
            if (!files.officeProof) newErrors.officeProof = "Office Proof is required.";
            if (!files.utilityBill) newErrors.utilityBill = "Utility Bill is required.";
            if (!files.signatoryLetter) newErrors.signatoryLetter = "Authorised Signatory Letter is required.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };
    
    const prevStep = () => setStep(step - 1);

    const handleViewPdf = (fileName) => {
        setPdfPreview(files[fileName]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
            setIsLoading(true);
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
                            <div className="form-group">
                                <label>Organisation Name</label>
                                <input name="organisationName" value={formData.organisationName} onChange={handleTextChange} className="form-control" />
                                {errors.organisationName && <p className="error-message">{errors.organisationName}</p>}
                            </div>
                            <div className="form-group">
                                <label>Organisation Address</label>
                                <input name="organisationAddress" value={formData.organisationAddress} onChange={handleTextChange} className="form-control" />
                                {errors.organisationAddress && <p className="error-message">{errors.organisationAddress}</p>}
                            </div>
                            <div className="form-group">
                                <label>Organisation Domain ID</label>
                                <input name="organisationDomainId" value={formData.organisationDomainId} onChange={handleTextChange} className="form-control" />
                                {errors.organisationDomainId && <p className="error-message">{errors.organisationDomainId}</p>}
                            </div>
                            <div className="form-group">
                                <label>Nature of Business</label>
                                <select name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleTextChange} className="form-control">
                                    <option value="">Select...</option>
                                    <option>Edtech</option>
                                    <option>Healthcare</option>
                                    <option>Consumer Durable</option>
                                    <option>Call Centres</option>
                                    <option>IT</option>
                                    <option>Insurance</option>
                                    <option>Banking</option>
                                    <option>Finance</option>
                                    <option>Other</option>
                                </select>
                                {errors.natureOfBusiness && <p className="error-message">{errors.natureOfBusiness}</p>}
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3>Section B – Authorised Signatory</h3>
                        <div className="form-grid">
                            <div className="form-group"><label>Full Name</label><input name="authorisedSignatoryFullName" value={formData.authorisedSignatoryFullName} onChange={handleTextChange} className="form-control" />{errors.authorisedSignatoryFullName && <p className="error-message">{errors.authorisedSignatoryFullName}</p>}</div>
                            <div className="form-group"><label>Mobile Number</label><input name="authorisedSignatoryMobile" type="tel" pattern="[0-9]{10}" value={formData.authorisedSignatoryMobile} onChange={handleTextChange} className="form-control" />{errors.authorisedSignatoryMobile && <p className="error-message">{errors.authorisedSignatoryMobile}</p>}</div>
                            <div className="form-group"><label>Email ID</label><input name="authorisedSignatoryEmail" type="email" value={formData.authorisedSignatoryEmail} onChange={handleTextChange} className="form-control" />{errors.authorisedSignatoryEmail && <p className="error-message">{errors.authorisedSignatoryEmail}</p>}</div>
                            <div className="form-group"><label>Designation</label><input name="authorisedSignatoryDesignation" value={formData.authorisedSignatoryDesignation} onChange={handleTextChange} className="form-control" />{errors.authorisedSignatoryDesignation && <p className="error-message">{errors.authorisedSignatoryDesignation}</p>}</div>
                        </div>
                    </>
                );
            case 3:
                return (
                     <>
                        <h3>Section C – Billing Contact</h3>
                        <div className="form-grid">
                            <div className="form-group"><label>Billing Contact Name</label><input name="billingContactName" value={formData.billingContactName} onChange={handleTextChange} className="form-control" />{errors.billingContactName && <p className="error-message">{errors.billingContactName}</p>}</div>
                            <div className="form-group"><label>Billing Contact Number</label><input name="billingContactNumber" type="tel" pattern="[0-9]{10}" value={formData.billingContactNumber} onChange={handleTextChange} className="form-control" />{errors.billingContactNumber && <p className="error-message">{errors.billingContactNumber}</p>}</div>
                            <div className="form-group"><label>Billing Email ID</label><input name="billingContactEmail" type="email" value={formData.billingContactEmail} onChange={handleTextChange} className="form-control" />{errors.billingContactEmail && <p className="error-message">{errors.billingContactEmail}</p>}</div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3>Mandatory Documents</h3>
                        <div className="document-upload-grid">
                            <div className="form-group"><label>Organisation Type</label><select name="organisationType" value={formData.organisationType} onChange={handleTextChange} className="form-control"><option>Pvt Ltd</option><option>LLP</option><option>Partnership</option><option>Proprietorship</option></select></div>
                            <div className="form-group"><label>Certificate of Incorporation</label><input name="certificateOfIncorporation" type="file" onChange={handleFileChange} className="form-control" />{errors.certificateOfIncorporation && <p className="error-message">{errors.certificateOfIncorporation}</p>}</div>
                            <div className="form-group"><label>GST Certificate</label><input name="gstCertificate" type="file" onChange={handleFileChange} className="form-control" />{errors.gstCertificate && <p className="error-message">{errors.gstCertificate}</p>}</div>
                            <div className="form-group"><label>PAN Card</label><input name="panCard" type="file" onChange={handleFileChange} className="form-control" />{errors.panCard && <p className="error-message">{errors.panCard}</p>}</div>
                            <div className="form-group"><label>Lease Agreement / Office Ownership Proof</label><input name="officeProof" type="file" onChange={handleFileChange} className="form-control" />{errors.officeProof && <p className="error-message">{errors.officeProof}</p>}</div>
                            <div className="form-group"><label>Utility Bill Type</label><select name="utilityBillType" value={formData.utilityBillType} onChange={handleTextChange} className="form-control"><option>Electricity Bill</option><option>Telephone Bill</option></select></div>
                            <div className="form-group"><label>Utility Bill Document</label><input name="utilityBill" type="file" onChange={handleFileChange} className="form-control" />{errors.utilityBill && <p className="error-message">{errors.utilityBill}</p>}</div>
                            <div className="form-group"><label>Authorised Signatory Letter</label><input name="signatoryLetter" type="file" onChange={handleFileChange} className="form-control" />{errors.signatoryLetter && <p className="error-message">{errors.signatoryLetter}</p>}</div>
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
            {Object.keys(errors).length > 0 && <div className="message error" style={{color: 'red', marginTop: '20px'}}>Please correct the errors before proceeding.</div>}
            
            {pdfPreview && <PdfViewerModal file={pdfPreview} onClose={() => setPdfPreview(null)} />}
        </form>
    );
};

export default MultiStepForm;