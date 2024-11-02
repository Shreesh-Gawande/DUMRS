import React from 'react';

const Profile = () => {
  const profileFields = [
    { label: 'First Name', value: 'Your First Name' },
    { label: 'Last Name', value: 'Your Last Name' },
    { label: 'Gender', value: 'Your Gender' },
    { label: 'Age', value: 'Your Age' },
    { label: 'Phone no', value: 'Your Phone No' },
    { label: 'Residential address', value: 'Address' }
  ];

  const ProfileField = ({ label, value }) => (
    <div>
      <div className="mt-10 ml-10 font-medium text-gray-700">{label}</div>
      <div className="bg-purple-50 border border-gray-200 text-gray-600 h-14 w-4/6 ml-10 mt-6 flex items-center rounded-lg shadow-sm hover:border-purple-300 transition-all duration-200">
        <div className="ml-6">{value}</div>
      </div>
    </div>
  );

  return (
    <section className="h-full w-full flex justify-center items-center p-6">
      <section className="h-11/12 w-11/12 bg-white rounded-2xl shadow-2xl flex flex-col relative">
        {/* Edit Button */}
        <div className="absolute top-6 right-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2">
            <i className="fa-solid fa-pen"></i>
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="h-1/4 w-full p-10">
          <div className="flex items-start">
            <div className="relative">
              <img 
                src="/api/placeholder/128/128" 
                alt="Profile" 
                className="h-32 w-32 rounded-full shadow-lg border-2 border-purple-200 object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-purple-100 p-2 rounded-full border-2 border-purple-300 hover:bg-purple-200 transition-all duration-200">
                <i className="fa-solid fa-camera text-purple-600"></i>
              </button>
            </div>

            <div className="ml-10 mt-4">
              <h1 className="text-2xl font-serif text-gray-800">Vamshidhar</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <i className="fa-solid fa-envelope text-purple-500 mr-2"></i>
                <span>vamshi16n@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
          {profileFields.map((field, index) => (
            <ProfileField 
              key={index} 
              label={field.label} 
              value={field.value}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Profile;