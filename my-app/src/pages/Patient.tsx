import { type FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { type Patient } from '../types/patient';
import { patientApi } from '../services/api';
import './Patient.css';

export const PatientPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError('');
      const patientId = parseInt(id || '0');
      
      if (!patientId) {
        setError('Неверный ID пациента');
        return;
      }

      const foundPatient = await patientApi.getPatientById(patientId);
      
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setError('Пациент не найден');
      }
    } catch (err) {
      console.error('Error loading patient:', err);
      setError('Ошибка загрузки данных пациента');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="patient-page">
        <Container>
          <div className="loading">Загрузка данных пациента...</div>
        </Container>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-page">
        <Container>
          <div className="error">
            <p>{error}</p>
            <Button 
              variant="primary" 
              className="medical-btn-primary"
              onClick={() => navigate('/patients')}
            >
              Вернуться к списку пациентов
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="patient-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10}>
            <div className="patient-info-title">Информация о пациенте:</div>
            
            <div className="patient-content-container">
              <div className="patient-photo-name-container">
                <div 
                  className="patient-photo"
                  style={{ 
                    backgroundImage: `url(http://localhost:9000/test/${patient.Patient_ID}.jpg)` 
                  }}
                  onError={(e) => {
                    e.currentTarget.style.backgroundImage = 'url(/default-patient.png)';
                  }}
                />
                <h2 className="patient-name-large">{patient.Name}</h2>
              </div>
              
              <div className="patient-info-card">
                <div className="patient-info">
                  <strong>Диабет {patient.Type} типа</strong><br />
                  <strong>Коэффициент чувствительности:</strong> {patient.Sensitivity}<br />
                  <strong>Целевое значение глюкозы:</strong> {patient.Glucose} ммоль/л
                  
                  {patient.Description && (
                    <>
                      <br /><br />
                      <strong>Дополнительная информация:</strong><br />
                      {patient.Description}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};