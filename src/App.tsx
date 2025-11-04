import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './Routes';
import { Navbar } from './components/Navbar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { HomePage } from './pages/Home';
import { PatientsPage } from './pages/Patients';
import { PatientPage } from './pages/Patient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
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
  );
}

export default App;