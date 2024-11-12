import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faFileText,
  faFlask,
  faStethoscope,
  faTemperatureFull,
  faHeartbeat,
  faClipboardList,
  faCalendarDay,
  faHospital,
  faHospitalSymbol,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sidebar'
import { RoleContext } from '../components/private';


const baseUrl = process.env.api;

const PatientRecords = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDiagnosticInfo, setExpandedDiagnosticInfo] = useState({});
  const navigate=useNavigate()
  const role=useContext(RoleContext)
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/patient/${id}/records`,{
        method:'GET',
        credentials:'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data.records || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (key) => {
    const response = await fetch(`${baseUrl}/patient/${id}/${key}`,{
      method:'GET',
      credentials:'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }
    const data = await response.json();
    const url = data.url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleDiagnosticInfo = (recordId) => {
    setExpandedDiagnosticInfo((prevState) => ({
      ...prevState,
      [recordId]: !prevState[recordId],
    }));
  };

  useEffect(() => {
    if(role==='authority'){
      navigate('/')
    }

    if (id) {
      fetchRecords();
    }
  }, [id]);

  if (!id) {
    return (
      <div className="flex-1 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-lg font-medium">No patient ID provided</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading records</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar id={id}/>
      <div className="w-[100%] flex-1 min-h-screen bg-gray-100 py-6">
      <div className="h-full mx-6  overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
        {!loading && (
          <div className=" space-y-4">
            {records.length === 0 ? (
              <div className="text-center mx-2 py-8 text-gray-500">No records found.</div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center text-gray-800">
                        <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 mr-3 text-purple-600" />
                        {new Date(record.visitDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h2>
                      <p className="text-gray-600 ml-8">{record.visitType} Visit</p>
                      {record.chiefComplaint && (
                        <div className="mt-4">
                          <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                            <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4 mr-2" />
                            Reason For Visit
                          </h3>
                          <p className="text-gray-700">{record.chiefComplaint}</p>
                        </div>
                      )}
                    </div>
                    {record.vitalSigns && (
                      <div className="bg-purple-100 p-4 rounded-lg flex flex-col items-end">
                        <div className="flex items-center mb-2">
                          <FontAwesomeIcon icon={faTemperatureFull} className="w-5 h-5 mr-3 text-purple-700" />
                          <span className="font-medium text-gray-800">Temperature: {record.vitalSigns.temperature}°F</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <FontAwesomeIcon icon={faHeartbeat} className="w-5 h-5 mr-3 text-purple-700" />
                          <span className="font-medium text-gray-800">Heart Rate: {record.vitalSigns.heartRate} bpm</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faStethoscope} className="w-5 h-5 mr-3 text-purple-700" />
                          <span className="font-medium text-gray-800">Blood Pressure: {record.vitalSigns.bloodPressure}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {record.diagnosticInformation && (
                      <div>
                        <div
                          className="flex items-center justify-between font-medium text-purple-700 mb-2 cursor-pointer"
                          onClick={() => toggleDiagnosticInfo(record.id)}
                        >
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faFlask} className="w-4 h-4 mr-2" />
                            Diagnostic Information
                          </div>
                          <FontAwesomeIcon
                            icon={expandedDiagnosticInfo[record.id] ? faChevronUp : faChevronDown}
                            className="w-4 h-4"
                          />
                        </div>
                        {expandedDiagnosticInfo[record.id] && (
                          <div className="overflow-x-auto">
                            <table className="w-full bg-purple-100 rounded-lg">
                              <thead>
                                <tr className="bg-purple-200 rounded-t-lg">
                                  <th className="px-4 py-3 text-left font-medium">Test Name</th>
                                  <th className="px-4 py-3 text-right font-medium">Report</th>
                                </tr>
                              </thead>
                              <tbody>
                                {record.diagnosticInformation.testResults.map((test, idx) => (
                                  <tr key={idx} className="border-b border-purple-200 last:border-b-0">
                                    <td className="px-4 py-3 text-left">{test.testName}</td>
                                    <td className="px-4 py-3 text-right">
                                      <button
                                        onClick={() => handleOpenFile(test.reportFileKey)}
                                        className="text-purple-700 hover:text-purple-800 flex items-center"
                                      >
                                        <FontAwesomeIcon icon={faFileText} className="w-4 h-4 mr-2" />
                                        View
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {record.dischargeSummary && (
                      <div>
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <FontAwesomeIcon icon={faHospital} className="w-4 h-4 mr-2" />
                          Discharge Summary
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-purple-100 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <FontAwesomeIcon icon={faCalendarDay} className="w-4 h-4 mr-2 text-purple-700" />
                              <span className="font-medium text-gray-800">
                                <strong>Admission Date:</strong>{' '}
                                {new Date(record.dischargeSummary.admissionDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faCalendarDay} className="w-4 h-4 mr-2 text-purple-700" />
                              <span className="font-medium text-gray-800">
                                <strong>Discharge Date:</strong>{' '}
                                {new Date(record.dischargeSummary.dischargeDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="bg-purple-100 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Discharge Summary</h4>
                            <p className="text-gray-700">{record.dischargeSummary.inpatientSummary}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {record.proceduralDetails && (
                      <div>
                        <h3 className="font-medium text-purple-700 mb-2 flex items-center">
                          <FontAwesomeIcon icon={faHospitalSymbol} className="w-4 h-4 mr-2" />
                          Procedural Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-purple-100 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Surgery Details</h4>
                            <p className="text-gray-700">
                              <strong>Surgery Type:</strong> {record.proceduralDetails.surgeryType}
                            </p>
                            <p className="text-gray-700">
                              <strong>Surgery Date:</strong>{' '}
                              {new Date(record.proceduralDetails.surgeryDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700">
                              <strong>Procedure Summary:</strong> {record.proceduralDetails.procedureSummary}
                            </p>
                          </div>
                          <div className="bg-purple-100 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Post-Op Instructions</h4>
                            <p className="text-gray-700">{record.proceduralDetails.postOpInstructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default PatientRecords;