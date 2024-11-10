import React from 'react';
import { Activity, Droplets, Scale, Ruler, AlertCircle } from 'lucide-react';
import { Graph } from '../components/graph';
import Sidebar from '../components/sidebar'

export const DashboardPage = () => {
  const allergies = [
    {
      substance: "Penicillin",
      reaction: "Severe rash and difficulty breathing"
    },
    {
      substance: "Peanuts",
      reaction: "Anaphylaxis"
    },
    {
      substance: "Latex",
      reaction: "Skin irritation and hives"
    },
    {
      substance: "Shellfish",
      reaction: "Severe swelling and nausea"
    }
  ];

  return (
    <div className='flex'>
        <Sidebar/>
        <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-lg border border-indigo-100">
        <div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back, John Doe</p>
        </div>
        <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
          Log Out
        </button>
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
              value="28" 
              trend="+1" 
            />
            <StatItem 
              icon={<Droplets className="text-purple-500" />}
              text="Blood Type" 
              value="B+" 
            />
            <StatItem 
              icon={<Scale className="text-indigo-500" />}
              text="Weight(kg)" 
              value="68" 
              trend="-2.3" 
            />
            <StatItem 
              icon={<Ruler className="text-purple-500" />}
              text="Height(cm)" 
              value="170" 
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
                {allergies.length} Known Allergies
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allergies.map((allergy, index) => (
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
            <Graph />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-[26%] bg-white p-4 md:p-5 rounded-xl shadow-lg border border-indigo-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recent Records
            </h2>
            <button className="text-indigo-600 text-sm hover:text-purple-600 transition-colors duration-200">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <RecordItem 
              title="Annual Checkup"
              date="2024-09-15"
              type="checkup"
              description="Routine annual checkup, all vitals were normal and no immediate health concerns were noted."
            />
            <RecordItem 
              title="Blood Test Results"
              date="2024-09-25"
              type="lab"
              description="Blood test for cholesterol levels showed slightly elevated LDL."
            />
            <RecordItem 
              title="Appendectomy"
              date="2024-08-10"
              type="surgery"
              description="Appendectomy performed due to acute appendicitis."
            />
            <RecordItem 
              title="CBC Test"
              date="2024-07-05"
              type="lab"
              description="Complete blood count test conducted. Results were normal."
            />
            <RecordItem 
              title="Cardiology Consultation"
              date="2024-10-01"
              type="consultation"
              description="Consultation with cardiologist due to occasional chest discomfort."
            />
          </div>
        </aside>
      </div>
    </div>
    </div>
  );
};

const StatItem = ({ icon, text, value, trend }) => (
  <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-100">
    <div className="h-12 w-12 flex justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-sm text-gray-500">{text}</p>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            parseFloat(trend) > 0 
              ? 'text-green-600 bg-green-50 border border-green-100' 
              : 'text-red-600 bg-red-50 border border-red-100'
          }`}>
            {trend}
          </span>
        )}
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
      checkup: 'bg-green-50 text-green-600 border-green-100',
      lab: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      surgery: 'bg-red-50 text-red-600 border-red-100',
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

