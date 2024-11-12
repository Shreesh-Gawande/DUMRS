import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, Camera, Edit2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/sidebar';
import { RoleContext } from '../components/private';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useContext(RoleContext);

  function formatToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    if (role === 'authority') {
      navigate('/');
    }
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.api}/patient/${id}/personalData`,{
          method:'GET',
          credentials:'include'
        });
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data[0]);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-purple-50 to-white">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-red-50">
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="text-red-600 font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Sidebar id={id} />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Personal Profile
              </h1>
              <p className="text-gray-500">Manage your personal information</p>
            </div>
            <div className="flex gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full flex items-center gap-2 shadow-lg shadow-purple-200 transition-transform hover:scale-105">
                <BadgeCheck className="w-5 h-5" />
                Active Records
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
            {/* Profile Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-8">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-40"></div>
                  <img
                    src="/images/misc/patient.svg"
                    alt="Profile"
                    className="relative w-28 h-28 rounded-2xl object-cover border-4 border-white"
                  />
                  <button className="absolute -bottom-3 -right-3 p-3 bg-white rounded-full shadow-lg border border-purple-100 hover:bg-purple-50 transition-all duration-200 group-hover:scale-110">
                    <Camera className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
                <div className="pt-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {profileData.fullName}
                  </h2>
                  <p className="text-gray-500 mt-1">{profileData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[
                { label: 'Date of Birth', value: formatToDDMMYYYY(profileData.dateOfBirth), icon: '🎂' },
                { label: 'Age', value: profileData.age, icon: '📅' },
                { label: 'Gender', value: profileData.gender, icon: '👤' },
                { label: 'Phone Number', value: profileData.phoneNumber, icon: '📱' },
                { label: 'Email', value: profileData.email, icon: '✉️' },
                { label: 'Address', value: profileData.address, icon: '🏠' }
              ].map((field, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-xl blur-sm transition-all group-hover:blur-md opacity-50"></div>
                  <div className="relative space-y-2 p-6 bg-white rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-lg">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <span>{field.icon}</span>
                      {field.label}
                    </label>
                    <div className="text-lg text-gray-700 font-medium">
                      {field.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;