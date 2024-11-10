import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle, FileUp, ChevronDown, ChevronUp, Syringe, Stethoscope, Building2, X, Check } from 'lucide-react';
import Sidebar from '../components/sidebar';


const AddMedicalRecord = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [includeHospitalStay, setIncludeHospitalStay] = useState(false);
  const [includeSurgery, setIncludeSurgery] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    id: '',
  visitType: '',
  visitDate: '',
  chiefComplaint: '',
  
  // Diagnostic Information
  vitalSigns: {
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
  },
  diagnosticTests: [],
  labResults: {
    bloodTests: [], // Make sure these are initialized as arrays
    urineTests: [], // Make sure these are initialized as arrays
    otherTests: []  // Make sure these are initialized as arrays
  },
  radiologyReports: [], // Make sure this is initialized as an array
  impressions: '',
  diagnosis: '',
    // Hospital Stay Information (Optional)
    dischargeSummary: {
      admissionDate: '',
      dischargeDate: '',
      inpatientSummary: '',
      referrals: []
    },
    
    // Surgical Information (Optional)
    procedures: {
      surgeryType: '',
      surgeryDate: '',
      anesthesiaType: '',
      procedureSummary: '',
      complications: '',
      postOpInstructions: ''
    }
  });

  // Validation rules
  const validateForm = () => {
    const errors = {};
    
    // Basic Info validation
    if (!formData.visitType) errors.visitType = 'Visit type is required';
    if (!formData.visitDate) errors.visitDate = 'Visit date is required';
    if (!formData.chiefComplaint) errors.chiefComplaint = 'Chief complaint is required';
    
    // Vital Signs validation
    if (!formData.vitalSigns.bloodPressure) errors.bloodPressure = 'Blood pressure is required';
    if (!formData.vitalSigns.heartRate) errors.heartRate = 'Heart rate is required';
    if (!formData.vitalSigns.temperature) errors.temperature = 'Temperature is required';
    
    // Diagnosis validation
    if (!formData.diagnosis) errors.diagnosis = 'Diagnosis is required';
    
    // Optional sections validation
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

  // Calculate form progress
  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = [
        formData.visitType,
        formData.visitDate,
        formData.chiefComplaint,
        formData.vitalSigns.bloodPressure,
        formData.vitalSigns.heartRate,
        formData.diagnosis
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

  const handleFileUpload = (fieldName, files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    const fileList = Array.from(files).map(file => {
      if (file.size > maxSize) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: `File ${file.name} exceeds 5MB limit`
        }));
        return null;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: `File ${file.name} must be JPEG, PNG, or PDF`
        }));
        return null;
      }
      
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size
      };
    }).filter(file => file !== null);
    
    // Update the state based on whether the field is nested or not
    setFormData(prev => {
      if (fieldName === 'bloodTests' || fieldName === 'urineTests' || fieldName === 'otherTests') {
        return {
          ...prev,
          labResults: {
            ...prev.labResults,
            [fieldName]: [...prev.labResults[fieldName], ...fileList]
          }
        };
      }
      return {
        ...prev,
        [fieldName]: [...prev[fieldName], ...fileList]
      };
    });
  };
  
  // Also update the removeFile function to handle nested properties
  const removeFile = (fieldName, fileIndex) => {
    setFormData(prev => {
      if (fieldName === 'bloodTests' || fieldName === 'urineTests' || fieldName === 'otherTests') {
        return {
          ...prev,
          labResults: {
            ...prev.labResults,
            [fieldName]: prev.labResults[fieldName].filter((_, index) => index !== fileIndex)
          }
        };
      }
      return {
        ...prev,
        [fieldName]: prev[fieldName].filter((_, index) => index !== fileIndex)
      };
    });
  };
  const Section = ({ title, icon, id, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setActiveSection(activeSection === id ? null : id)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold text-purple-600">{title}</h2>
        </div>
        {activeSection === id ? <ChevronUp /> : <ChevronDown />}
      </div>
      {activeSection === id && children}
    </div>
  );

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

  return (
    <div className='flex'>
        <Sidebar/>
        <div className="w-[100%] p-6 space-y-6">
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
      >
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type*</label>
              <select 
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.visitType ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.visitType}
                onChange={(e) => setFormData({...formData, visitType: e.target.value})}
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
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.visitDate ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.visitDate}
                onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
              />
              {validationErrors.visitDate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.visitDate}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint*</label>
            <textarea
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                validationErrors.chiefComplaint ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
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
      >
        <div className="space-y-6">
          {/* Vital Signs */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Vital Signs*</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <input
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.bloodPressure ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="120/80 mmHg"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                <input
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.heartRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="BPM"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <input
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.temperature ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="°F"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, temperature: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Lab Results */}
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
                  <FileUp size={20} />
                  Upload Blood Test Results
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
                  <FileUp size={20} />
                  Upload Urine Test Results
                </label>
                <FilePreview files={formData.labResults.urineTests} fieldName="urineTests" />
              </div>
            </div>
          </div>

          {/* Radiology Reports */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Radiology Reports</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <select 
                className="p-2 border border-gray-300 rounded-lg"
                onChange={(e) => setFormData({
                  ...formData,
                  radiologyType: e.target.value
                })}
              >
                <option value="">Select Scan Type</option>
                <option value="xray">X-Ray</option>
                <option value="mri">MRI</option>
                <option value="ct">CT Scan</option>
                <option value="ultrasound">Ultrasound</option>
              </select>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  id="radiology-file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('radiologyReports', e.target.files)}
                />
                <label 
                  htmlFor="radiology-file"
                  className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <FileUp size={20} />
                  Upload Scans
                </label>
              </div>
            </div>
            <FilePreview files={formData.radiologyReports} fieldName="radiologyReports" />
          </div>

          {/* Diagnosis */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Diagnosis*</h3>
            <textarea
              className={`w-full p-2 border rounded-lg ${
                validationErrors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              placeholder="Enter detailed diagnosis"
            />
            {validationErrors.diagnosis && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.diagnosis}</p>
            )}
          </div>
        </div>
      </Section>

      {/* Optional Sections Toggle */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Sections</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeHospitalStay}
              onChange={(e) => setIncludeHospitalStay(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span>Include Hospital Stay Information</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSurgery}
              onChange={(e) => setIncludeSurgery(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span>Include Surgical Information</span>
          </label>
        </div>
      </div>

      {/* Hospital Stay Information (Optional) */}
      {includeHospitalStay && (
        <Section 
          title="Hospital Stay Information" 
          icon={<Building2 className="text-purple-600" />}
          id="hospital"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date*</label>
                <input 
                  type="date"
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.admissionDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.dischargeSummary.admissionDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dischargeSummary: {
                      ...prev.dischargeSummary,
                      admissionDate: e.target.value
                    }
                  }))}
                />
                {validationErrors.admissionDate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.admissionDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Date*</label>
                <input 
                  type="date"
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.dischargeDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.dischargeSummary.dischargeDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dischargeSummary: {
                      ...prev.dischargeSummary,
                      dischargeDate: e.target.value
                    }
                  }))}
                />
                {validationErrors.dischargeDate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.dischargeDate}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inpatient Summary</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-lg h-32"
                placeholder="Enter detailed summary of the hospital stay..."
                value={formData.dischargeSummary.inpatientSummary}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dischargeSummary: {
                    ...prev.dischargeSummary,
                    inpatientSummary: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Surgical Information (Optional) */}
      {includeSurgery && (
        <Section 
          title="Surgical Information" 
          icon={<Syringe className="text-purple-600" />}
          id="surgery"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type*</label>
                <input 
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.surgeryType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter surgery type"
                  value={formData.procedures.surgeryType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    procedures: {
                      ...prev.procedures,
                      surgeryType: e.target.value
                    }
                  }))}
                />
                {validationErrors.surgeryType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.surgeryType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Date*</label>
                <input 
                  type="date"
                  className={`w-full p-2 border rounded-lg ${
                    validationErrors.surgeryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.procedures.surgeryDate}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    procedures: {
                      ...prev.procedures,
                      surgeryDate: e.target.value
                    }
                  }))}
                />
                {validationErrors.surgeryDate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.surgeryDate}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anesthesia Type</label>
              <input 
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter anesthesia type"
                value={formData.procedures.anesthesiaType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  procedures: {
                    ...prev.procedures,
                    anesthesiaType: e.target.value
                  }
                }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Summary</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-lg h-32"
                placeholder="Enter detailed procedure summary..."
                value={formData.procedures.procedureSummary}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  procedures: {
                    ...prev.procedures,
                    procedureSummary: e.target.value
                  }
                }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complications</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter any complications..."
                value={formData.procedures.complications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  procedures: {
                    ...prev.procedures,
                    complications: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Submit Button */}
      <div className="sticky bottom-6 bg-white p-4 rounded-xl shadow-sm">
        <button 
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => {
            if (validateForm()) {
              console.log('Form submitted:', formData);
              // Add your submission logic here
            }
          }}
        >
          Save Medical Record
        </button>
      </div>
    </div>
    </div>
  );
};

export default AddMedicalRecord;