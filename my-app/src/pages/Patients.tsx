import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { type Patient } from '../types/patient';
import { patientApi } from '../services/api';
import './Patients.css';

export const PatientsPage: FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientApi.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Поиск */}
            <div className="search-patients-container">
              <InputGroup className="search-patients-input">
                <Form.Control
                  type="text"
                  placeholder="Поиск по сайту"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text className="search-patients-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="#00a9bf" stroke-width="2"/>
                    <path d="M11 11L15 15" stroke="#00a9bf" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </InputGroup.Text>
              </InputGroup>
            </div>

            {/* Сетка пациентов с фотографиями */}
            <div className="patients-grid">
              {filteredPatients.map(patient => (
                <Link 
                  to={`/patients/${patient.Patient_ID}`} 
                  key={patient.Patient_ID} 
                  className="patient-card"
                >
                  <div className="patient-card-content">
                    {/* Фотография пациента */}
                    <div className="patient-image-container">
                      <img 
                        src={`http://localhost:9000/test/${patient.Patient_ID}.jpg`} 
                        alt={patient.Name}
                        className="patient-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-patient.png';
                        }}
                      />
                    </div>
                    
                    {/* Информация о пациенте */}
                    <div className="patient-info">
                      <h3 className="patient-name">{patient.Name}</h3>
                      <div className="sensitivity-section">
                        <p className="sensitivity-label">Коэффициент чувствительности:</p>
                        <p className="sensitivity-value">{patient.Sensitivity}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Иконка калькулятора */}
      <div className="calculation-icon">
        <Link to="/calculator" className="calculation-link">
          <svg width="44" height="47" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H40V41H4V12Z" fill="#00a9bf"/>
            <path d="M4 12H40V17H4V12Z" fill="#00a9bf"/>
            <path d="M12 6H32V12H12V6Z" fill="#00a9bf"/>
          </svg>
          {patients.length > 0 && (
            <span className="calculation-count">{patients.length}</span>
          )}
        </Link>
      </div>
    </div>
  );
};