import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, FileUp, ChevronDown, ChevronUp, Syringe, Stethoscope, Building2, X, Check, Loader2 } from 'lucide-react';
import Sidebar from '../components/sidebar';
import { useParams } from 'react-router-dom';

const AlertMessage = ({ type, message }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]} flex items-center gap-3`}>
      {type === 'success' && <Check className="text-green-500" size={20} />}
      {type === 'error' && <AlertCircle className="text-red-500" size={20} />}
      {type === 'warning' && <AlertCircle className="text-yellow-500" size={20} />}
      <p>{message}</p>
    </div>
  );
};

const Section = ({ title, icon, id, isActive, onToggle, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
    <div 
      className="flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold text-purple-600">{title}</h2>
      </div>
      {isActive ? <ChevronUp /> : <ChevronDown />}
    </div>
    {isActive && children}
  </div>
);

const LoadingOverlay = ({ isVisible, message }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
        <Loader2 className="animate-spin text-purple-600" />
        <span className="text-gray-700">{message}</span>
      </div>
    </div>
  );
};

const FileUploadStatus = ({ isUploading, fieldName, error }) => {
  if (!isUploading && !error) return null;
  
  return (
    <div className="mt-2">
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <Loader2 className="animate-spin" size={16} />
          <span>Uploading {fieldName}...</span>
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};



const AddMedicalRecord = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [includeHospitalStay, setIncludeHospitalStay] = useState(false);
  const [includeSurgery, setIncludeSurgery] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState({
    bloodTests: false,
    urineTests: false,
    otherTests: false
  });
  
  const {patientId} = useParams();

  const [formData, setFormData] = useState({
    visitType: '',
    visitDate: '',
    chiefComplaint: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
    },
    labResults: {
      bloodTests: [],
      urineTests: [],
      otherTests: []
    },
    dischargeSummary: {
      admissionDate: '',
      dischargeDate: '',
      inpatientSummary: '',
    },
    procedures: {
      surgeryType: '',
      surgeryDate: '',
      procedureSummary: '',
      postOpInstructions: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (fieldName, files) => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    setIsUploading(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      const fileList = Array.from(files).map(file => {
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }
        
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} must be JPEG, PNG, or PDF`);
        }
        
        return {
          file: file,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
        };
      });
      
      setFormData(prev => ({
        ...prev,
        labResults: {
          ...prev.labResults,
          [fieldName]: [...prev.labResults[fieldName], ...fileList]
        }
      }));
      
      setValidationErrors(prev => ({ ...prev, [fieldName]: null }));
    } catch (error) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: error.message }));
    } finally {
      setIsUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.visitType) errors.visitType = 'Visit type is required';
    if (!formData.visitDate) errors.visitDate = 'Visit date is required';
    if (!formData.chiefComplaint) errors.chiefComplaint = 'Chief complaint is required';
    
    if (!formData.vitalSigns.bloodPressure) errors.bloodPressure = 'Blood pressure is required';
    if (!formData.vitalSigns.heartRate) errors.heartRate = 'Heart rate is required';
    if (!formData.vitalSigns.temperature) errors.temperature = 'Temperature is required';
    
    if (includeHospitalStay) {
      if (!formData.dischargeSummary.admissionDate) errors.admissionDate = 'Admission date is required';
      if (!formData.dischargeSummary.dischargeDate) errors.dischargeDate = 'Discharge date is required';
    }
    
    if (includeSurgery) {
      if (!formData.procedures.surgeryType) errors.surgeryType = 'Surgery type is required';
      if (!formData.procedures.surgeryDate) errors.surgeryDate = 'Surgery date is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatFormDataForSubmission = () => {
    const formDataToSubmit = new FormData();
    
    formDataToSubmit.append('patientId', patientId);
    formDataToSubmit.append('visitType', formData.visitType);
    formDataToSubmit.append('visitDate', formData.visitDate);
    formDataToSubmit.append('chiefComplaint', formData.chiefComplaint);
    
    formDataToSubmit.append('vitalSigns', JSON.stringify(formData.vitalSigns));

    if (includeHospitalStay) {
      formDataToSubmit.append('dischargeSummary', JSON.stringify(formData.dischargeSummary));
    }

    if (includeSurgery) {
      formDataToSubmit.append('procedures', JSON.stringify(formData.procedures));
    }
    
    formData.labResults.bloodTests.forEach((fileData) => {
      formDataToSubmit.append('bloodTests', fileData.file);
    });
    
    formData.labResults.urineTests.forEach((fileData) => {
      formDataToSubmit.append('urineTests', fileData.file);
    });
    
    formData.labResults.otherTests.forEach((fileData) => {
      formDataToSubmit.append('otherTests', fileData.file);
    });

    return formDataToSubmit;
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    
    if (!validateForm()) {
      setSubmitError("Please fix the validation errors before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = formatFormDataForSubmission();
      
      const response = await fetch(`http://localhost:4000/patient/${patientId}/add-record`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save medical record');
      }
      
      const savedRecord = await response.json();
      setSubmitSuccess(true);
      console.log('Record saved successfully:', savedRecord);
      
    } catch (error) {
      console.error('Error submitting medical record:', error);
      setSubmitError(error.message || 'An error occurred while saving the record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (fieldName, fileIndex) => {
    setFormData(prev => {
      const fileToRemove = prev.labResults[fieldName][fileIndex];
      if (fileToRemove?.url) URL.revokeObjectURL(fileToRemove.url);
      
      return {
        ...prev,
        labResults: {
          ...prev.labResults,
          [fieldName]: prev.labResults[fieldName].filter((_, index) => index !== fileIndex)
        }
      };
    });
  };


  const FilePreview = ({ files, fieldName }) => (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileUp size={20} className="text-gray-500" />
            <span className="text-sm text-gray-700">{file.name}</span>
            <span className="text-xs text-gray-500">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={() => removeFile(fieldName, index)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
  

  useEffect(() => {
    return () => {
      Object.values(formData.labResults).forEach(files => {
        files.forEach(file => {
          if (file.url) URL.revokeObjectURL(file.url);
        });
      });
    };
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = [
        formData.visitType,
        formData.visitDate,
        formData.chiefComplaint,
        formData.vitalSigns.bloodPressure,
        formData.vitalSigns.heartRate
      ];
      
      const optionalFields = [
        ...(includeHospitalStay ? [
          formData.dischargeSummary.admissionDate,
          formData.dischargeSummary.dischargeDate
        ] : []),
        ...(includeSurgery ? [
          formData.procedures.surgeryType,
          formData.procedures.surgeryDate
        ] : [])
      ];
      
      const totalFields = requiredFields.length + optionalFields.length;
      const filledFields = [...requiredFields, ...optionalFields].filter(field => field).length;
      
      setFormProgress(Math.round((filledFields / totalFields) * 100));
    };
    
    calculateProgress();
  }, [formData, includeHospitalStay, includeSurgery]);
  

  

  return (
    <div className='flex'>
      <Sidebar id={patientId}/>
      <div className="w-[100%] p-6 space-y-6">
      <LoadingOverlay 
          isVisible={isSubmitting} 
          message="Saving medical record..." 
        />
        
        {submitSuccess && (
          <AlertMessage
            type="success"
            message="Medical record saved successfully!"
          />
        )}
        
        {submitError && (
          <AlertMessage
            type="error"
            message={submitError}
          />
        )}
        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-purple-600">Medical Record</h1>
            <span className="text-sm text-gray-600">{formProgress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${formProgress}%` }}
            />
          </div>
        </div>

        {/* Basic Information */}
        <Section 
          title="Basic Information" 
          icon={<Stethoscope className="text-purple-600" />}
          id="basic"
          isActive={activeSection === 'basic'}
          onToggle={() => setActiveSection(activeSection === 'basic' ? null : 'basic')}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type*</label>
                <select 
                  name="visitType"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.visitType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.visitType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Inpatient">Inpatient</option>
                  <option value="Emergency">Emergency</option>
                </select>
                {validationErrors.visitType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.visitType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date*</label>
                <input 
                  type="date"
                  name="visitDate"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.visitDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.visitDate}
                  onChange={handleInputChange}
                />
                {validationErrors.visitDate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.visitDate}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint*</label>
              <textarea
                name="chiefComplaint"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.chiefComplaint ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                value={formData.chiefComplaint}
                onChange={handleInputChange}
                placeholder="Describe the main reason for visit"
              />
              {validationErrors.chiefComplaint && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.chiefComplaint}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Diagnostic Information */}
        <Section 
          title="Diagnostic Information" 
          icon={<Syringe className="text-purple-600" />}
          id="diagnostic"
          isActive={activeSection === 'diagnostic'}
          onToggle={() => setActiveSection(activeSection === 'diagnostic' ? null : 'diagnostic')}
        >
          <div className="space-y-6">
            {/* Vital Signs */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Vital Signs*</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                  <input
                    name="vitalSigns.bloodPressure"
                    className={`w-full p-2 border rounded-lg ${
                      validationErrors.bloodPressure ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="120/80 mmHg"
                    value={formData.vitalSigns.bloodPressure}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                  <input
                    name="vitalSigns.heartRate"
                    className={`w-full p-2 border rounded-lg ${
                      validationErrors.heartRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="BPM"
                    value={formData.vitalSigns.heartRate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                  <input
                    name="vitalSigns.temperature"
                    className={`w-full p-2 border rounded-lg ${
                      validationErrors.temperature ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="°F"
                    value={formData.vitalSigns.temperature}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Lab Results section remains the same as it uses file handling */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Lab Results</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Tests</label>
                  <input
                    type="file"
                    className="hidden"
                    id="blood-tests"
                    multiple
                    onChange={(e) => handleFileUpload('bloodTests', e.target.files)}
                  />
                  <label 
                    htmlFor="blood-tests"
                    className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <PlusCircle className="text-purple-600" />
                    <span>Upload Blood Test Results</span>
                  </label>
                  <FilePreview files={formData.labResults.bloodTests} fieldName="bloodTests" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urine Tests</label>
                  <input
                    type="file"
                    className="hidden"
                    id="urine-tests"
                    multiple
                    onChange={(e) => handleFileUpload('urineTests', e.target.files)}
                  />
                  <label 
                    htmlFor="urine-tests"
                    className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <PlusCircle className="text-purple-600" />
                    <span>Upload Urine Test Results</span>
                  </label>
                  <FilePreview files={formData.labResults.urineTests} fieldName="urineTests" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Tests</label>
                  <input
                    type="file"
                    className="hidden"
                    id="other-tests"
                    multiple
                    onChange={(e) => handleFileUpload('otherTests', e.target.files)}
                  />
                  <label 
                    htmlFor="other-tests"
                    className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <PlusCircle className="text-purple-600" />
                    <span>Upload Other Test Results</span>
                  </label>
                  <FilePreview files={formData.labResults.otherTests} fieldName="otherTests" />
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* Hospital Stay Section */}
        <Section 
          title="Hospital Stay" 
          icon={<Building2 className="text-purple-600" />}
          id="hospital"
          isActive={activeSection === 'hospital'}
          onToggle={() => setActiveSection(activeSection === 'hospital' ? null : 'hospital')}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="include-hospital"
                checked={includeHospitalStay}
                onChange={(e) => setIncludeHospitalStay(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="include-hospital" className="text-sm text-gray-700">
                Include Hospital Stay Information
              </label>
            </div>

            {includeHospitalStay && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date*</label>
                    <input
                      type="date"
                      name="dischargeSummary.admissionDate"
                      className={`w-full p-2 border rounded-lg ${
                        validationErrors.admissionDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.dischargeSummary.admissionDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Date*</label>
                    <input
                      type="date"
                      name="dischargeSummary.dischargeDate"
                      className={`w-full p-2 border rounded-lg ${
                        validationErrors.dischargeDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.dischargeSummary.dischargeDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inpatient Summary</label>
                  <textarea
                    name="dischargeSummary.inpatientSummary"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                    value={formData.dischargeSummary.inpatientSummary}
                    onChange={handleInputChange}
                    placeholder="Enter inpatient summary"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Surgery Section */}
        <Section 
          title="Surgery Information" 
          icon={<AlertCircle className="text-purple-600" />}
          id="surgery"
          isActive={activeSection === 'surgery'}
          onToggle={() => setActiveSection(activeSection === 'surgery' ? null : 'surgery')}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="include-surgery"
                checked={includeSurgery}
                onChange={(e) => setIncludeSurgery(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="include-surgery" className="text-sm text-gray-700">
                Include Surgery Information
              </label>
            </div>

            {includeSurgery && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type*</label>
                    <input
                      type="text"
                      name="procedures.surgeryType"
                      className={`w-full p-2 border rounded-lg ${
                        validationErrors.surgeryType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.procedures.surgeryType}
                      onChange={handleInputChange}
                      placeholder="Enter surgery type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Date*</label>
                    <input
                      type="date"
                      name="procedures.surgeryDate"
                      className={`w-full p-2 border rounded-lg ${
                        validationErrors.surgeryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.procedures.surgeryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Summary</label>
                  <textarea
                    name="procedures.procedureSummary"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                    value={formData.procedures.procedureSummary}
                    onChange={handleInputChange}
                    placeholder="Enter procedure summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post-Op Instructions</label>
                  <textarea
                    name="procedures.postOpInstructions"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                    value={formData.procedures.postOpInstructions}
                    onChange={handleInputChange}
                    placeholder="Enter post-operative instructions"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={() => {
              setFormData({
                id: '',
                visitType: '',
                visitDate: '',
                chiefComplaint: '',
                vitalSigns: {
                  bloodPressure: '',
                  heartRate: '',
                  temperature: '',
                  respiratoryRate: '',
                  oxygenSaturation: '',
                },
                diagnosticTests: [],
                labResults: {
                  bloodTests: [],
                  urineTests: [],
                  otherTests: []
                },
                impressions: '',
                dischargeSummary: {
                  admissionDate: '',
                  dischargeDate: '',
                  inpatientSummary: '',
                  referrals: []
                },
                procedures: {
                  surgeryType: '',
                  surgeryDate: '',
                  anesthesiaType: '',
                  procedureSummary: '',
                  complications: '',
                  postOpInstructions: ''
                }
              });
              setValidationErrors({});
            }}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleFormSubmission}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              'Save Record'
            )}
          </button>
        </div>
        <LoadingOverlay 
          isVisible={isSubmitting} 
          message="Saving medical record..." 
        />
        
        {submitSuccess && (
          <AlertMessage
            type="success"
            message="Medical record saved successfully!"
          />
        )}
        
        {submitError && (
          <AlertMessage
            type="error"
            message={submitError}
          />
        )}
      </div>
    </div>
  );
};

export default AddMedicalRecord;