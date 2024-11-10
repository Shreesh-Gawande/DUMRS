import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css';
import { DoctorLogin } from "./pages/doctorlogin";
import {DashboardPage} from "./pages/dashboard";
import MedicalProfile from "./pages/medicalInfo";
import AddMedicalRecord from "./pages/addrecord";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorLogin/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/medical-info" element={<MedicalProfile/>}/>
          <Route path="/add-record" element={<AddMedicalRecord/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;