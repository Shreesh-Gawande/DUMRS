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
import Records from "./pages/records";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorLogin/>}/>
          <Route path="/dashboard/:patient_id" element={<DashboardPage/>}/>
          <Route path="/medical-info/:patient_id" element={<MedicalProfile/>}/>
          <Route path="/add-record/:patientId" element={<AddMedicalRecord/>}/>
          <Route path="/add-patient" element={<PatientRegistrationForm/>}/>
          <Route path="/add-hospital" element={<HospitalRegistrationForm/>}/>
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/records/:id" element={<Records/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/doctor/dashboard" element={<HospitalDashboard/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;