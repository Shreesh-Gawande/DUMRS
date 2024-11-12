import React, { useContext, useEffect, useState } from 'react';
import { Activity, Droplets, Scale, Ruler, AlertCircle } from 'lucide-react';
import { Graph } from '../components/graph';
import Sidebar from '../components/sidebar';
import { useParams,useNavigate } from 'react-router-dom';
import LogoutComponent from '../components/logout';
import { RoleContext } from '../components/private';
const baseUrl = process.env.REACT_APP_API;
export const DashboardPage = () => {
  const { patient_id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const navigate=useNavigate()
  const role=useContext(RoleContext)

  function formatToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

  useEffect(() => {

    if(role==='authority'){
      navigate('/')
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(baseUrl+`/users/patient/staticData/${patient_id}`,{
          method:'GET',
          credentials:'include'
        });
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Patient not found' : 'Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchRecentRecords = async () => {
      try {
        const response = await fetch(baseUrl+`/patient/records/recent/${patient_id}`,{
          method:'GET',
          credentials:'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recent records');
        }
        const records = await response.json();
        setRecentRecords(records);
      } catch (err) {
        setError(err.message);
      }
    };

    if (patient_id) {
      fetchPatientData();
      fetchRecentRecords()
    }
  }, [patient_id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-indigo-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center text-red-600">
            <AlertCircle className="mr-2" size={24} />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return null;
  }

  return (
    <div className='flex'>
      <Sidebar id={patient_id}/>
      <div className="w-[100%] p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
        {/* Header Section */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-lg border border-indigo-100">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Patient Dashboard
            </h1>
            <p className="text-sm text-gray-500">Patient ID: {patient_id}</p>
          </div>
          <LogoutComponent/>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content Area */}
          <main className="w-full lg:w-[74%] space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 md:p-6 rounded-xl shadow-lg border border-indigo-100">
              <StatItem 
                icon={<Activity className="text-indigo-500" />}
                text="Age" 
                value={patientData.age} 
              />
              <StatItem 
                icon={<Droplets className="text-purple-500" />}
                text="Blood Type" 
                value={patientData.bloodType} 
              />
              <StatItem 
                icon={<Scale className="text-indigo-500" />}
                text="Weight(kg)" 
                value={patientData.weight} 
              />
              <StatItem 
                icon={<Ruler className="text-purple-500" />}
                text="Height(cm)" 
                value={patientData.height} 
              />
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-purple-500" size={24} />
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Allergies
                  </h2>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-100">
                  {patientData.allergies.length} Known Allergies
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patientData.allergies.map((allergy, index) => (
                  <AllergyCard 
                    key={index}
                    substance={allergy.substance}
                    reaction={allergy.reaction}
                  />
                ))}
              </div>
            </div>
            
            {/* Graph Component */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-indigo-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Health Metrics
                </h2>
                <select className="w-full sm:w-auto px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <Graph id={patient_id}/>
            </div>
          </main>

          {/* Recent Records Section - Static */}
          <aside className="w-full lg:w-[26%] bg-white p-4 md:p-5 rounded-xl shadow-lg border border-indigo-100 h-fit">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Recent Records
          </h2>
          <button className="text-indigo-600 text-sm hover:text-purple-600 transition-colors duration-200"
             onClick={()=>{navigate(`/records/${patient_id}`)}}>
            View All
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {recentRecords.map((record, index) => (
            <RecordItem
              key={index}
              title={record.visitType}
              date={formatToDDMMYYYY(record.visitDate)}
              type={record.visitType.toLowerCase()}
              description={record.chiefComplaint}
            />
          ))}
        </div>
      </aside>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, text, value }) => (
  <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-100">
    <div className="h-12 w-12 flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-sm text-gray-500">{text}</p>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
      </div>
    </div>
  </div>
);

const AllergyCard = ({ substance, reaction }) => (
  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-indigo-100 hover:border-purple-200 transition-all duration-200 shadow-sm hover:shadow-md">
    <div className="flex items-start justify-between mb-2">
      <div>
        <h3 className="font-medium text-gray-800">{substance}</h3>
        <div className="mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full inline-block border border-red-200">
          High Risk
        </div>
      </div>
      <AlertCircle className="text-purple-500" size={20} />
    </div>
    <p className="text-sm text-gray-600 mt-2">
      {reaction}
    </p>
  </div>
);

const RecordItem = ({ title, date, type, description }) => {
  const getTypeStyles = (type) => {
    const styles = {
      Inpatient: 'bg-green-50 text-green-600 border-green-100',
      Outpatient: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      Emergency: 'bg-red-50 text-red-600 border-red-100',
      consultation: 'bg-purple-50 text-purple-600 border-purple-100'
    };
    return styles[type] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  return (
    <div className="p-4 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full capitalize border ${getTypeStyles(type)}`}>
          {type}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};