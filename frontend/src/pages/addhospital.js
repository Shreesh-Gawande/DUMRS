import React, { useState, useEffect, useContext } from 'react';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { RoleContext } from '../components/private';
import { useNavigate } from 'react-router-dom';

const HospitalRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    phoneNumber: '',
    email: ''
  });
  const role=useContext(RoleContext)
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const navigate=useNavigate()
  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Hospital name is required' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? 'Please enter a valid email address' 
          : '';
      case 'phoneNumber':
        return !/^\+?[\d\s-]{10,}$/.test(value) 
          ? 'Please enter a valid phone number' 
          : '';
      case 'address.zipCode':
        return !/^\d{5}(-\d{4})?$/.test(value) 
          ? 'Please enter a valid ZIP code' 
          : '';
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
      'name',
      'email',
      'phoneNumber',
      'address.street',
      'address.city',
      'address.state',
      'address.zipCode'
    ];

    const completedFields = requiredFields.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return formData[parent][child].trim() !== '' && !errors[field];
      }
      return formData[field].trim() !== '' && !errors[field];
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

  const handleSubmit = async (e) => {
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
        const response = await fetch('http://localhost:4000/users/hospital/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubmitStatus({
          type: 'success',
          message: 'Hospital registration successful!'
        });
        
        // Reset form
        setFormData({
          name: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          phoneNumber: '',
          email: ''
        });
        setTouched({});
        
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to register hospital. Please try again later.'
        });
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-blue-600">Hospital Registration</h1>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Hospital Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.name && touched.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-blue-200 focus:ring-blue-500'
                      } focus:border-transparent focus:ring-2`}
                      required
                    />
                    {errors.name && touched.name && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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
                  <label className="block text-sm font-medium text-blue-700 mb-1">
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
                          : 'border-blue-200 focus:ring-blue-500'
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

            {/* Submit Button and Status */}
            <div className="mt-8">
              {submitStatus.message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0 && progress!==100}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium 
                  ${isSubmitting || Object.keys(errors).length > 0 && progress!==100
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Circle className="w-5 h-5 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  'Register Hospital'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistrationForm;