import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Building2, UserPlus, LogOut } from 'lucide-react';
import LogoutComponent from '../components/logout';

const AdminDashboard = () => {
    const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.clear('token')
    localStorage.clear('userRole')
    navigate('/')
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50">
      {/* Header with Logout */}
      <div className="fixed top-0 right-0 p-6">
        <LogoutComponent/>
      </div>

      {/* Main Content - Perfectly Centered */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Welcome to MedAdmin
            </h1>
            <p className="text-gray-500">
              Manage your healthcare facilities and patients efficiently
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              to="/add-hospital" 
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Building2 className="h-12 w-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-white">Add Hospital</span>
            </Link>

            <Link 
              to="/add-patient" 
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <UserPlus className="h-12 w-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-semibold text-white">Add Patient</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;