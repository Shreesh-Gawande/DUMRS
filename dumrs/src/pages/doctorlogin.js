import { useState, useEffect } from "react";

export function DoctorLogin() {
  const [error, setError] = useState(null);
  const [hide, setHide] = useState(true);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setValid] = useState(false);
  const [role, setRole] = useState(null); // Stores the selected role

  // Validation logic
  const validateInputs = () => {
    if (id.length !== 10 || password.length === 0) {
      setError("Please enter a valid ID and password");
      setValid(false);
      return false;
    }
    setError(null);
    setValid(true);
    return true;
  };

  // Submit handler based on selected role
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      if (role === "Doctor") {
        console.log("Doctor Login");
      } else if (role === "Patient") {
        console.log("Patient Login");
      } else if (role === "Admin") {
        console.log("Admin Login");
      }
    }
  };

  useEffect(() => {
    validateInputs();
  }, [id, password]);

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
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</div>
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
                      className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none text-sm"
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
                      className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none text-sm"
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
                  disabled={!isValid}
                  className="w-full bg-[#8699DA] text-white py-2.5 rounded-lg disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all hover:bg-[#7385c6] mt-4 text-sm"
                >
                  Sign In
                </button>
              </form>

              {/* Back link to re-select role */}
              <button
                onClick={() => setRole(null)}
                className="text-[#8699DA] text-sm hover:underline mt-4"
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
