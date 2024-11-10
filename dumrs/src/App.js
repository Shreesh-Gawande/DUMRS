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

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorLogin/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/medical-info" element={<MedicalProfile/>}/>
          <Route path="/add-record" element={<AddMedicalRecord/>}/>
          <Route path="/add-patient" element={<PatientRegistrationForm/>}/>
          <Route path="/add-hospital" element={<HospitalRegistrationForm/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/doctor/dashboard" element={<HospitalDashboard/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;