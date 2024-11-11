import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function DoctorLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [hide, setHide] = useState(true);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setValid] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation logic
  const validateInputs = () => {
    if (id.length !== 10) {
      setError("ID must be exactly 10 characters long");
      setValid(false);
      return false;
    }
    if (password.length === 0) {
      setError("Password is required");
      setValid(false);
      return false;
    }
    setError(null);
    setValid(true);
    return true;
  };

  const handleDoctorLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hospital_id: id,
          hospital_password: password
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'doctor');
        navigate('/doctor/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: id,
          patientPassword: password
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'patient');
        navigate(`/dashboard/${id}`);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/authority', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authority_id: id,
          authority_password: password
        }),
        credentials:"include"
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      switch (role) {
        case "Doctor":
          await handleDoctorLogin();
          break;
        case "Patient":
          await handlePatientLogin();
          break;
        case "Admin":
          await handleAdminLogin();
          break;
      }
    }
  };

  useEffect(() => {
    validateInputs();
  }, [id, password]);

  // Custom loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-5 w-5 mr-2" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center p-4 font-nunito">
      <div className="w-full max-w-5xl flex items-center justify-between gap-8">
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <h1 className="text-4xl lg:text-5xl font-semibold text-[#8699DA] mb-8">UMRS</h1>

          {/* Initial Role Selection */}
          {!role ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">Sign in as</h2>
              <button
                onClick={() => setRole("Doctor")}
                className="w-full bg-[#8699DA] font-medium text-white py-2.5 rounded-lg transition-all hover:bg-[#7385c6] text-sm"
              >
                Doctor
              </button>
              <button
                onClick={() => setRole("Patient")}
                className="w-full bg-[#8DA869] font-medium text-white py-2.5 rounded-lg transition-all hover:bg-[#7a925b] text-sm"
              >
                Patient
              </button>
              <button
                onClick={() => setRole("Admin")}
                className="w-full bg-[#DA8686] font-medium text-white py-2.5 rounded-lg transition-all hover:bg-[#c37070] text-sm"
              >
                Admin
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-medium">Welcome {role}</h2>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {/* Error Icon */}
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-gray-700 text-sm font-medium">ID</label>
                  <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <input
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      type="text"
                      placeholder="0123456789"
                      className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none text-sm disabled:bg-gray-50"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-700 text-sm font-medium">Password</label>
                  <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={hide ? "password" : "text"}
                      placeholder="Your password"
                      className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none text-sm disabled:bg-gray-50"
                      disabled={isLoading}
                    />
                    <img
                      src={hide ? "/images/icons/show.png" : "/images/icons/hide.png"}
                      alt="toggle visibility"
                      onClick={() => setHide(!hide)}
                      className="mr-3 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full bg-[#8699DA] text-white py-2.5 rounded-lg disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all hover:bg-[#7385c6] mt-4 text-sm
                           flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Back link to re-select role */}
              <button
                onClick={() => {
                  setRole(null);
                  setError(null);
                  setId("");
                  setPassword("");
                }}
                className="text-[#8699DA] text-sm hover:underline mt-4 disabled:opacity-50"
                disabled={isLoading}
              >
                Back to role selection
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block w-1/2">
          <img
            src="/images/misc/doc.svg"
            className="w-full max-w-lg mx-auto"
            alt="Doctor illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;