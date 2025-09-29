import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const PdfViewerModal = ({ file, onClose }) => {
    if (!file) return null;
    const fileUrl = URL.createObjectURL(file);
    console.log("FileUrl : ",fileUrl )
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>PDF Preview: {file.name}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body" style={{ height: '70vh' }}>
                    <iframe src={fileUrl} width="100%" height="100%" title={file.name} style={{ border: 'none' }} />
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
        authorisedSignatoryCountryCode: '+91',
        authorisedSignatoryMobile: '',
        authorisedSignatoryEmail: '',
        authorisedSignatoryDesignation: '',
        billingContactName: '',
        billingContactCountryCode: '+91',
        billingContactNumber: '',
        billingContactEmail: '',
        organisationType: 'Pvt Ltd',
        utilityBillType: 'Electricity Bill',
        accountManagerId: '',
    });
    const [files, setFiles] = useState({});
    const [documentIds, setDocumentIds] = useState({});
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [accountManagers, setAccountManagers] = useState([]);

    useEffect(() => {
        const fetchAccountManagers = async () => {
            try {
                const response = await api.get('/account-managers');
                setAccountManagers(response.data);
            } catch (error) {
                console.error("Failed to fetch account managers:", error);
            }
        };
        fetchAccountManagers();
    }, []);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleIdChange = (e) => {
        setDocumentIds({ ...documentIds, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        const file = selectedFiles[0];
        
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid file type. Only PDF, JPG, PNG are allowed.' }));
                e.target.value = null;
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, [name]: 'File is too large. Maximum size is 5MB.' }));
                e.target.value = null;
                return;
            }
            
            setErrors(prev => ({ ...prev, [name]: null }));
            setFiles(prev => ({ ...prev, [name]: file }));
        }
    };
    
    const validateStep = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (step === 1) {
            if (!formData.organisationName) newErrors.organisationName = "Organisation Name is required.";
            if (!formData.organisationAddress) newErrors.organisationAddress = "Organisation Address is required.";
            if (!formData.organisationDomainId) newErrors.organisationDomainId = "Organisation Domain ID is required.";
            if (!formData.natureOfBusiness) newErrors.natureOfBusiness = "Nature of Business is required.";
        } else if (step === 2) {
            if (!formData.authorisedSignatoryCountryCode) newErrors.authorisedSignatoryCountryCode = "Country code is required.";
            if (!phoneRegex.test(formData.authorisedSignatoryMobile)) newErrors.authorisedSignatoryMobile = "A valid 10-digit number is required.";
            if (!emailRegex.test(formData.authorisedSignatoryEmail)) newErrors.authorisedSignatoryEmail = "A valid email is required.";
        } else if (step === 3) {
            if (!formData.billingContactCountryCode) newErrors.billingContactCountryCode = "Country code is required.";
            if (!phoneRegex.test(formData.billingContactNumber)) newErrors.billingContactNumber = "A valid 10-digit number is required.";
            if (!emailRegex.test(formData.billingContactEmail)) newErrors.billingContactEmail = "A valid email is required.";
        }else if (step === 4) {
            const requiredDocs = ['certificateOfIncorporation', 'gstCertificate', 'panCard', 'officeProof', 'utilityBill', 'signatoryLetter'];
            requiredDocs.forEach(doc => {
                if (!documentIds[doc + 'Id']) {
                    newErrors[doc + 'Id'] = "Document ID is required.";
                }
                if (!files[doc]) {
                    newErrors[doc] = "File upload is required.";
                }
            });
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
        data.append('documentIds', JSON.stringify(documentIds));
        
        try {
            setIsLoading(true);
            await api.post('/clients', data);
            setMessage('Client created successfully!');
            setTimeout(() => {
                setStep(1);
                setFormData({ organisationName: '', organisationAddress: '', organisationDomainId: '', natureOfBusiness: '', authorisedSignatoryFullName: '', authorisedSignatoryMobile: '', authorisedSignatoryEmail: '', authorisedSignatoryDesignation: '', billingContactName: '', billingContactNumber: '', billingContactEmail: '', organisationType: 'Pvt Ltd', utilityBillType: 'Electricity Bill', accountManagerId: '' });
                setFiles({});
                setDocumentIds({});
                setMessage('');
                if(onClientAdded) onClientAdded();
            }, 2000);
        } catch (err) {
            setErrors(err.response?.data?.message || 'Error creating client.');
        } finally {
            setIsLoading(false);
        }
    };
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3 className="form-step-heading">Section A – Organisation Details</h3>
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
                                    <option>Automobile</option>
                                    <option>Travel</option>
                                    <option>BPO</option>
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
                        <h3 className="form-step-heading">Section B – Authorised Signatory</h3>
                        <div className="form-grid">
                            <div className="form-group"><label>Company Name</label><input name="authorisedSignatoryFullName" value={formData.authorisedSignatoryFullName} onChange={handleTextChange} className="form-control" /></div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <div className="input-group">
                                    <select name="authorisedSignatoryCountryCode" value={formData.authorisedSignatoryCountryCode} onChange={handleTextChange} className="form-control country-code">
                                        <option>+91</option>
                                        <option>+1</option>
                                    </select>
                                    <input name="authorisedSignatoryMobile" type="tel" value={formData.authorisedSignatoryMobile} onChange={handleTextChange} className="form-control" />
                                </div>
                                {errors.authorisedSignatoryMobile && <p className="error-message">{errors.authorisedSignatoryMobile}</p>}
                            </div>
                            <div className="form-group"><label>Email ID</label><input name="authorisedSignatoryEmail" type="email" value={formData.authorisedSignatoryEmail} onChange={handleTextChange} className="form-control" />{errors.authorisedSignatoryEmail && <p className="error-message">{errors.authorisedSignatoryEmail}</p>}</div>
                            <div className="form-group"><label>Designation</label><input name="authorisedSignatoryDesignation" value={formData.authorisedSignatoryDesignation} onChange={handleTextChange} className="form-control" /></div>
                        </div>
                    </>
                );
            case 3:
                return (
                     <>
                        <h3 className="form-step-heading">Section C – Billing Contact</h3>
                        <div className="form-grid">
                            <div className="form-group"><label>Billing Contact Name</label><input name="billingContactName" value={formData.billingContactName} onChange={handleTextChange} className="form-control" /></div>
                            <div className="form-group">
                                <label>Billing Contact Number</label>
                                <div className="input-group">
                                    <select name="billingContactCountryCode" value={formData.billingContactCountryCode} onChange={handleTextChange} className="form-control country-code">
                                        <option>+91</option>
                                        <option>+1</option>
                                    </select>
                                    <input name="billingContactNumber" type="tel" value={formData.billingContactNumber} onChange={handleTextChange} className="form-control" />
                                </div>
                                {errors.billingContactNumber && <p className="error-message">{errors.billingContactNumber}</p>}
                            </div>
                            <div className="form-group"><label>Billing Email ID</label><input name="billingContactEmail" type="email" value={formData.billingContactEmail} onChange={handleTextChange} className="form-control" />{errors.billingContactEmail && <p className="error-message">{errors.billingContactEmail}</p>}</div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3 className="form-step-heading">Documents & Account Manager</h3>
                        <div className="document-upload-grid">
                            <div className="document-field">
                                <label>Certificate of Incorporation</label>
                                <div className="document-input-group">
                                    <input name="certificateOfIncorporationId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="certificateOfIncorporation" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.certificateOfIncorporationId && <p className="error-message">{errors.certificateOfIncorporationId}</p>}
                                {errors.certificateOfIncorporation && <p className="error-message">{errors.certificateOfIncorporation}</p>}
                            </div>
                            <div className="document-field">
                                <label>GST Certificate</label>
                                <div className="document-input-group">
                                    <input name="gstCertificateId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="gstCertificate" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.gstCertificateId && <p className="error-message">{errors.gstCertificateId}</p>}
                                {errors.gstCertificate && <p className="error-message">{errors.gstCertificate}</p>}
                            </div>
                            <div className="document-field">
                                <label>Company PAN Card</label>
                                <div className="document-input-group">
                                    <input name="panCardId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="panCard" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.panCardId && <p className="error-message">{errors.panCardId}</p>}
                                {errors.panCard && <p className="error-message">{errors.panCard}</p>}
                            </div>
                            <div className="document-field">
                                <label>Lease Agreement / Office Ownership Proof</label>
                                <div className="document-input-group">
                                    <input name="officeProofId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="officeProof" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.officeProofId && <p className="error-message">{errors.officeProofId}</p>}
                                {errors.officeProof && <p className="error-message">{errors.officeProof}</p>}
                            </div>
                            <div className="document-field">
                                <label>Utility Bill Document</label>
                                <div className="document-input-group">
                                    <input name="utilityBillId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="utilityBill" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.utilityBillId && <p className="error-message">{errors.utilityBillId}</p>}
                                {errors.utilityBill && <p className="error-message">{errors.utilityBill}</p>}
                            </div>
                            <div className="document-field">
                                <label>Authorised Signatory Letter</label>
                                <div className="document-input-group">
                                    <input name="signatoryLetterId" placeholder="Enter Document ID" onChange={handleIdChange} className="form-control" />
                                    <input name="signatoryLetter" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                                {errors.signatoryLetterId && <p className="error-message">{errors.signatoryLetterId}</p>}
                                {errors.signatoryLetter && <p className="error-message">{errors.signatoryLetter}</p>}
                            </div>
                            <div className="document-field">
                                <label>Board Resolution (Optional)</label>
                                <div className="document-input-group">
                                    <input name="boardResolutionId" placeholder="Enter Document ID (if applicable)" onChange={handleIdChange} className="form-control" />
                                    <input name="boardResolution" type="file" onChange={handleFileChange} className="form-control" />
                                </div>
                            </div>
                             <div className="form-group">
                                <label>Assign Account Manager</label>
                                <select name="accountManagerId" value={formData.accountManagerId} onChange={handleTextChange} className="form-control">
                                    <option value="">Select an Account Manager</option>
                                    {accountManagers.map(manager => (
                                        <option key={manager.id} value={manager.id}>{manager.name}</option>
                                    ))}
                                </select>
                                {errors.accountManagerId && <p className="error-message">{errors.accountManagerId}</p>}
                            </div>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <h3 className="form-step-heading">Preview Details</h3>
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
                                <p><strong>Company Name:</strong> {formData.authorisedSignatoryFullName}</p>
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
        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="multi-step-form-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Organisation</div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>Signatory</div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Billing</div>
                    <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>Documents</div>
                    <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>Preview</div>
                </div>

                <div className="form-content">
                    {renderStep()}
                </div>
                
                <div className="form-navigation">
                    {step > 1 && <button type="button" className="btn btn-secondary" onClick={prevStep}>Previous</button>}
                    {step < 5 && <button type="button" className="btn btn-primary" onClick={nextStep}>Next</button>}
                    {step === 5 && (
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit Client Details'}
                        </button>
                    )}
                </div>

                {message && <div className="message success">{message}</div>}
                
                {pdfPreview && <PdfViewerModal file={pdfPreview} onClose={() => setPdfPreview(null)} />}
            </form>
        </div>
    );
};

export default MultiStepForm;