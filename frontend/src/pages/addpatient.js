import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../components/private';
const baseUrl = process.env.REACT_APP_API;

const PatientRegistrationForm = () => {
    const navigate=useNavigate()
    const role=useContext(RoleContext)
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        bloodType: '',  
        phoneNumber: '',
        email: '',
        emergencyPhone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const getNestedValue = (obj, path) => {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return value === undefined ? '' : value;
};

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.length < 2 ? 'Full name is required' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? 'Please enter a valid email address' 
          : '';
      case 'phoneNumber':
      case 'emergencyPhone':
        return !/^\+?[\d\s-]{10,}$/.test(value) 
          ? 'Please enter a valid phone number' 
          : '';
      case 'address.zipCode':
        return !/^\d{6}(-\d{5})?$/.test(value) 
          ? 'Please enter a valid ZIP code' 
          : '';
          case 'height':
            return !/^\d{1,3}$/.test(value) 
              ? 'Please enter a valid height in cm' 
              : '';
          case 'weight':
            return !/^\d{1,3}(\.\d{1,2})?$/.test(value) 
              ? 'Please enter a valid weight in kg' 
              : '';
              case 'bloodType':
                return value === '' ? 'Blood type is required' : '';        
      default:
        return value.trim() === '' ? `${name.split('.').pop()} is required` : '';
    }
  };

  // Calculate form progress
  useEffect(() => {
    if(role!=='authority'){
      navigate('/')
    }
    const requiredFields = [
        'fullName',
        'dateOfBirth',
        'gender',
        'height',    // new
        'weight',    // new
        'bloodType',
        'email',
        'phoneNumber',
        'emergencyPhone',
        'address.street',
        'address.city',
        'address.state',
        'address.zipCode'
      ];

      const completedFields = requiredFields.filter(field => {
        const value = getNestedValue(formData, field);
        return value.toString().trim() !== '' && !errors[field];
    });

    setProgress((completedFields.length / requiredFields.length) * 100);
  }, [formData, errors]);

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

    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object') {
        Object.keys(formData[key]).forEach(nestedKey => {
          const error = validateField(
            `${key}.${nestedKey}`, 
            formData[key][nestedKey]
          );
          if (error) newErrors[`${key}.${nestedKey}`] = error;
        });
      } else {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
        setIsSubmitting(true);
        setSubmitStatus({ type: '', message: '' });
        
        try {
          const response = await fetch(baseUrl+'/users/patient/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify(formData)
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setSubmitStatus({
            type: 'success',
            message: 'Patient registration successful!'
          });
          
          // Reset form
          setFormData({
            fullName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            phoneNumber: '',
            emergencyPhone: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: ''
            }
          });
          setTouched({});
          
        } catch (error) {
          setSubmitStatus({
            type: 'error',
            message: 'Failed to register patient. Please try again.'
          });
          console.error('Submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-purple-600">New Patient Registration</h1>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.fullName && touched.fullName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.fullName && touched.fullName && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.dateOfBirth && touched.dateOfBirth
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.dateOfBirth && touched.dateOfBirth && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.dateOfBirth}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.gender && touched.gender
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && touched.gender && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.gender}
                      </div>
                    )}
                  </div>
                </div>
                <div>
  <label className="block text-sm font-medium text-purple-700 mb-1">
    Height (cm)
  </label>
  <div className="relative">
    <input
      type="number"
      name="height"
      value={formData.height}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className={`w-full px-4 py-2 rounded-lg border ${
        errors.height && touched.height
          ? 'border-red-500 focus:ring-red-500'
          : 'border-purple-200 focus:ring-purple-500'
      } focus:border-transparent focus:ring-2`}
      required
    />
    {errors.height && touched.height && (
      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {errors.height}
      </div>
    )}
  </div>
</div>

<div>
  <label className="block text-sm font-medium text-purple-700 mb-1">
    Weight (kg)
  </label>
  <div className="relative">
    <input
      type="number"
      name="weight"
      value={formData.weight}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className={`w-full px-4 py-2 rounded-lg border ${
        errors.weight && touched.weight
          ? 'border-red-500 focus:ring-red-500'
          : 'border-purple-200 focus:ring-purple-500'
      } focus:border-transparent focus:ring-2`}
      required
    />
    {errors.weight && touched.weight && (
      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {errors.weight}
      </div>
    )}
  </div>
</div>

<div>
  <label className="block text-sm font-medium text-purple-700 mb-1">
    Blood Type
  </label>
  <div className="relative">
    <select
      name="bloodType"
      value={formData.bloodType}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className={`w-full px-4 py-2 rounded-lg border ${
        errors.bloodType && touched.bloodType
          ? 'border-red-500 focus:ring-red-500'
          : 'border-purple-200 focus:ring-purple-500'
      } focus:border-transparent focus:ring-2`}
      required
    >
      <option value="">Select blood type</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </select>
    {errors.bloodType && touched.bloodType && (
      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {errors.bloodType}
      </div>
    )}
  </div>
</div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email && touched.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.email && touched.email && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phoneNumber && touched.phoneNumber
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.emergencyPhone && touched.emergencyPhone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.emergencyPhone && touched.emergencyPhone && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.emergencyPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors['address.street'] && touched['address.street']
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors['address.street'] && touched['address.street'] && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors['address.street']}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors['address.city'] && touched['address.city']
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors['address.city'] && touched['address.city'] && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors['address.city']}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors['address.state'] && touched['address.state']
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors['address.state'] && touched['address.state'] && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors['address.state']}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    ZIP Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors['address.zipCode'] && touched['address.zipCode']
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-purple-200 focus:ring-purple-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors['address.zipCode'] && touched['address.zipCode'] && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors['address.zipCode']}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center px-4 py-6">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress >= 33 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-400'
                }`}>
                  {progress >= 33 ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-purple-600">Personal Info</span>
              </div>
              <div className="h-0.5 flex-1 mx-4 bg-purple-100">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress >= 66 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-400'
                }`}>
                  {progress >= 66 ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-purple-600">Contact Info</span>
              </div>
              <div className="h-0.5 flex-1 mx-4 bg-purple-100">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${Math.max(0, progress - 66) * 3}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress === 100 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-400'
                }`}>
                  {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-purple-600">Address</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!progress===100}
              className={`w-full py-3 px-6 rounded-lg transition duration-200 font-medium ${
                Object.keys(errors).length > 0 && progress!==100
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isSubmitting 
                ? 'Submitting...' 
                : progress === 100 
                  ? 'Register Patient' 
                  : 'Complete All Fields'
              }
            </button>
            {submitStatus.message && (
            <div
              role="alert"
              className={`mb-4 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

            {/* Form Status Message */}
            {Object.keys(errors).length > 0 && touched.fullName && progress!==100 && (
              <div className="text-red-500 text-sm flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                Please fix the errors above to continue
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;