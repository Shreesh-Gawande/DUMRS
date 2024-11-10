import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css';
import { DoctorLogin } from "./pages/doctorlogin";
import {DashboardPage} from "./pages/dashboard";
import MedicalProfile from "./pages/medicalInfo";
import AddMedicalRecord from "./pages/addrecord";
import PatientRegistrationForm from "./pages/addpatient";
import Profile from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorLogin/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/medical-info" element={<MedicalProfile/>}/>
          <Route path="/add-record" element={<AddMedicalRecord/>}/>
          <Route path="/add-patient" element={<PatientRegistrationForm/>}/>
          <Route path="/profile" element={<Profile/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;