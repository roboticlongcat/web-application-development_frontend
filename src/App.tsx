import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './Routes';
import { Navbar } from './components/Navbar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { HomePage } from './pages/Home';
import { PatientsPage } from './pages/Patients';
import { PatientPage } from './pages/Patient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Tauri launched")})
      .catch(() =>{console.log("Tauri not launched")})
    return () => {
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Tauri launched")})
        .catch(() =>{console.log("Tauri not launched")})
    };
  }, [])
  return (
     <Router basename="/web-application-development_frontend">
       <div className="App">
         <Navbar />
         <Breadcrumbs />
         <main className="main-content">
           <Routes>
             <Route path={ROUTES.Home} element={<HomePage />} />
             <Route path={ROUTES.Patients} element={<PatientsPage />} />
             <Route path={ROUTES.Patient} element={<PatientPage />} />
           </Routes>
         </main>
       </div>
     </Router>
    )
}

export default App;