import React, { useContext, useEffect, useState } from 'react';
import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutComponent from '../components/logout';
import { RoleContext } from '../components/private';
const HospitalDashboard = () => {
    const navigate=useNavigate()
  const [patientId, setPatientId] = useState('');
  const role=useContext(RoleContext)

  const handleSearch = (e) => {
    e.preventDefault();
    if (patientId.length === 10) {
      navigate(`/dashboard/${patientId}`)
    }
  };

  useEffect(()=>{
    if(role!=='doctor'){
      navigate('/')
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <LogoutComponent/>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto p-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome to MedAdmin
            </h1>
            <p className="text-gray-600">
              Manage your healthcare facilities and patients efficiently
            </p>
          </div>

          {/* Search Section */}
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter 10-digit Patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={10}
                />
              </div>
              <button
                type="submit"
                disabled={patientId.length !== 10}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                Search
              </button>
            </div>
            {patientId.length > 0 && patientId.length < 10 && (
              <p className="mt-2 text-sm text-gray-500">
                Please enter all 10 digits of the patient ID
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;