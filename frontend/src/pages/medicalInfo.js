import React, { useState, useRef, useEffect,useContext } from 'react';
import { 
  Droplets, 
  AlertCircle, 
  Heart, 
  Users, 
  Syringe, 
  Shield,
  AlertOctagon,
  ChevronRight,
  Plus,
  X,
  Loader
} from 'lucide-react';
import Sidebar from '../components/sidebar';
import { useParams } from 'react-router-dom';
import { RoleContext } from '../components/private';
const userRole=localStorage.getItem('userRole')
const MedicalProfile = () => {
  const { patient_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = useContext(RoleContext)
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:4000/users/patient/${patient_id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient_id]);

  const handleAddEntry = async (section, newEntry) => {
    try {
      const response = await fetch(`http://localhost:4000/users/patient/${patient_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          newEntry
        }),
      });
  
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to add entry');
      }
  
      setData(prev => ({
        ...prev,
        [section]: [...prev[section], result.data.newEntry]
      }));
     
  
    } catch (error) {
      console.error('Error adding entry:', error);
    
    }
  };

  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600">No medical records found for this patient.</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex">
      <Sidebar id={patient_id}/>
      <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-violet-200 p-6 mb-6 hover:shadow-xl transition-shadow">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Medical Profile
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-lg border border-violet-200 hover:bg-violet-100 transition-colors">
              <Droplets className="text-violet-500" size={20} />
              <span className="text-lg font-semibold text-violet-600">{data.bloodType}</span>
            </div>
            <div className="bg-fuchsia-50 px-4 py-2 rounded-lg border border-fuchsia-200 hover:bg-fuchsia-100 transition-colors">
              <span className="text-fuchsia-600 font-medium">Active Records</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Allergies Section */}
            <Section 
              title="Allergies" 
              icon={<AlertCircle className="text-red-500" />}
              addButton={
                <Modal
                  title="Add New Allergy"
                  fields={[
                    { name: 'substance', label: 'Substance', type: 'text' },
                    { name: 'reaction', label: 'Reaction', type: 'text' }
                  ]}
                  onSubmit={(values) => handleAddEntry('allergies', values)}
                />
              }
            >
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.allergies.map((allergy, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{allergy.substance}</h3>
                      <AlertOctagon className="text-red-500" size={18} />
                    </div>
                    <p className="text-sm text-gray-600">{allergy.reaction}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Chronic Conditions */}
            <Section 
              title="Chronic Conditions" 
              icon={<Heart className="text-fuchsia-500" />}
              addButton={
                <Modal
                  title="Add Chronic Condition"
                  fields={[
                    { name: 'condition', label: 'Condition', type: 'text' },
                    { name: 'dateDiagnosed', label: 'Date Diagnosed', type: 'date' }
                  ]}
                  onSubmit={(values) => handleAddEntry('chronicConditions', values)}
                />
              }
            >
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.chronicConditions.map((condition, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl border border-fuchsia-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">{condition.condition}</h3>
                        <p className="text-sm text-gray-500">
                          Diagnosed: {new Date(condition.dateDiagnosed).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="text-fuchsia-400" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Family Medical History */}
            <Section 
              title="Family Medical History" 
              icon={<Users className="text-violet-500" />}
              addButton={
                <Modal
                  title="Add Family Medical History"
                  fields={[
                    { name: 'relation', label: 'Relation', type: 'text' },
                    { name: 'condition', label: 'Condition', type: 'text' }
                  ]}
                  onSubmit={(values) => handleAddEntry('familyMedicalHistory', values)}
                />
              }
            >
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.familyMedicalHistory.length > 0 ? (
                  data.familyMedicalHistory.map((history, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{history.relation}</h3>
                          <p className="text-sm text-gray-600">{history.condition}</p>
                        </div>
                        <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-lg text-sm">
                          Family
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No family medical history recorded" />
                )}
              </div>
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Surgeries Section */}
            <Section 
              title="Surgical History" 
              icon={<Syringe className="text-teal-500" />}
              addButton={
                <Modal
                  title="Add Surgery"
                  fields={[
                    { name: 'procedure', label: 'Procedure', type: 'text' },
                    { name: 'date', label: 'Date', type: 'date' },
                    { name: 'hospital', label: 'Hospital', type: 'text' },
                    { name: 'surgeon', label: 'Surgeon', type: 'text' },
                    { name: 'notes', label: 'Notes', type: 'textarea' }
                  ]}
                  onSubmit={(values) => handleAddEntry('surgeries', values)}
                />
              }
            >
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.surgeries.map((surgery, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{surgery.procedure}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(surgery.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-teal-100 text-teal-600 rounded-lg text-xs">
                        Surgery
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hospital:</span> {surgery.hospital}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Surgeon:</span> {surgery.surgeon}
                      </p>
                      {surgery.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {surgery.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Immunization Records */}
            <Section 
              title="Immunization Records" 
              icon={<Syringe className="text-green-500" />}
              addButton={
                <Modal
                  title="Add Immunization Record"
                  fields={[
                    { name: 'vaccine', label: 'Vaccine', type: 'text' },
                    { name: 'dateReceived', label: 'Date Received', type: 'date' },
                    { name: 'boosterShot', label: 'Booster Shot', type: 'checkbox' }
                  ]}
                  onSubmit={(values) => handleAddEntry('immunizationRecords', values)}
                />
              }
            >
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.immunizationRecords.map((record, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{record.vaccine}</h3>
                        <p className="text-sm text-gray-500">
                          Received: {new Date(record.dateReceived).toLocaleDateString()}
                        </p>
                      </div>
                      {record.boosterShot && (
                        <div className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs">
                          Booster Shot
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Insurance Details */}
            <Section 
              title="Health Insurance" 
              icon={<Shield className="text-blue-500" />}
              addButton={
                <Modal
                  title="Update Insurance Details"
                  fields={[
                    { name: 'provider', label: 'Provider', type: 'text' },
                    { name: 'coverage', label: 'Coverage Plan', type: 'text' },
                    { name: 'policyNumber', label: 'Policy Number', type: 'text' },
                    { name: 'coPayAmount', label: 'Co-Pay Amount', type: 'number' }
                  ]}
                  onSubmit={(values)=>{handleAddEntry('healthInsuranceDetails',values)}}
                />
              }
            >
              <div className="p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Provider</label>
                    <p className="font-semibold text-gray-800">{data.healthInsuranceDetails.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Coverage Plan</label>
                    <p className="font-semibold text-gray-800">{data.healthInsuranceDetails.coverage}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-sm text-gray-500">Policy Number</label>
                      <p className="font-semibold text-gray-800">{data.healthInsuranceDetails.policyNumber}</p>
                    </div>
                    <div className="text-right">
                      <label className="text-sm text-gray-500">Co-Pay Amount</label>
                      <p className="font-semibold text-gray-800">${data.healthInsuranceDetails.coPayAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
            </div>
            </div>
            </div>
            </div>
  )
}

const Modal = ({ title, fields, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const modalRef = useRef();
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({});
      setIsOpen(false);
    };
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-200 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
  
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              ref={modalRef}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
  
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label 
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        rows={3}
                      />
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.name}
                          name={field.name}
                          checked={formData[field.name] || false}
                          onChange={handleChange}
                          className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={field.name}
                          className="ml-2 text-sm text-gray-600"
                        >
                          {field.label}
                        </label>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-violet-200 text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white hover:bg-violet-700 rounded-md transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };
  
  // Section component
  const Section = ({ title, icon, children, addButton }) => (
    <div className="bg-white rounded-xl shadow-lg border border-violet-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        {userRole==='doctor'&&addButton}
      </div>
      {children}
    </div>
  );
  
  // Empty state component
  const EmptyState = ({ message }) => (
    <div className="p-6 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
  
  export default MedicalProfile;