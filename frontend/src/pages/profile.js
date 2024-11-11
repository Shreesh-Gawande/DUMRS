import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BadgeCheck, Camera, Edit2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/sidebar';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  function formatToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/patient/${id}/personalData`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        console.log(data)
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
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-purple-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex items-center gap-2 text-red-600 text-lg">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
        <Sidebar id={id}/>
        <div className="w-[100%] min-h-screen bg-gray-50 p-6">
      <div className=" w-[100%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-purple-600">Personal Profile</h1>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              Active Records
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src="/images/misc/patient.svg"
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-purple-100"
                />
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-purple-100 hover:bg-purple-50 transition-all duration-200">
                  <Camera className="w-4 h-4 text-purple-600" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profileData.fullName}
                </h2>
                <p className="text-gray-500 mt-1">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[
              { label: 'Date of Birth', value: formatToDDMMYYYY(profileData.dateOfBirth) },
              { label: 'Age', value: profileData.age },
              { label: 'Gender', value: profileData.gender },
              { label: 'Phone Number', value: profileData.phoneNumber },
              { label: 'Email', value: profileData.email },
              { label: 'Address', value: profileData.address }
            ].map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  {field.label}
                </label>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-gray-700">
                  {field.value}
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