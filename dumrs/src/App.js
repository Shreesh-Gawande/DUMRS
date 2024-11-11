import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css';
import { DoctorLogin } from "./pages/doctorlogin";
import {DashboardPage} from "./pages/dashboard";
import MedicalProfile from "./pages/medicalInfo";
import AddMedicalRecord from "./pages/addrecord";
import PatientRegistrationForm from "./pages/addpatient";
import Profile from "./pages/profile";
import AdminDashboard from "./pages/admindashboard";
import HospitalRegistrationForm from "./pages/addhospital";
import HospitalDashboard from "./pages/hosptialdashboard";
import { PrivateRoute } from "./components/private";
import PatientRecords from "./pages/records";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorLogin/>}/>
          <Route
            path="/dashboard/:patient_id"
            element={
              <PrivateRoute>
                <DashboardPage/>
              </PrivateRoute>
            }
          />
          <Route
            path="/medical-info/:patient_id"
            element={
              <PrivateRoute>
                <MedicalProfile/>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-record/:patientId"
            element={
              <PrivateRoute>
                <AddMedicalRecord/>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-patient"
            element={
              <PrivateRoute>
                <PatientRegistrationForm/>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-hospital"
            element={
              <PrivateRoute>
                <HospitalRegistrationForm/>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile/>
              </PrivateRoute>
            }
          />
          <Route
            path="/records/:id"
            element={
              <PrivateRoute>
                <PatientRecords/>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard/>
              </PrivateRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <PrivateRoute>
                <HospitalDashboard/>
              </PrivateRoute>
            }
          />
       </Routes>
    </BrowserRouter>
  );
}

export default App;