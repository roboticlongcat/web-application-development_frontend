import { type FC, useState, useEffect, useRef } from 'react';
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
  const [fromMock, setFromMock] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageLoadedRef = useRef(false);

  useEffect(() => {
    console.log('PatientPage: useEffect triggered, id:', id);
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError('');
      setFromMock(false);
      setImageError(false);
      imageLoadedRef.current = false;
      
      const patientId = parseInt(id || '0');
      console.log('PatientPage: Loading patient with ID:', patientId);
      
      if (!patientId) {
        setError('Неверный ID пациента');
        return;
      }

      const { patient: foundPatient, fromMock: isFromMock } = await patientApi.getPatientById(patientId);
      console.log('PatientPage: API response - patient:', foundPatient, 'fromMock:', isFromMock);
      
      if (foundPatient) {
        setPatient(foundPatient);
        setFromMock(isFromMock);
      } else {
        setError('Пациент не найден');
      }
    } catch (err) {
      console.error('PatientPage: Error loading patient:', err);
      setError('Ошибка загрузки данных пациента');
      setFromMock(true);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения картинки пациента
  const getPatientImage = () => {
    if (!patient) {
      return '/web-application-development_frontend/default-patient.png';
    }
    
    // Если уже была ошибка загрузки или используем моки - сразу дефолтная картинка
    if (imageError || fromMock) {
      return '/web-application-development_frontend/default-patient.png';
    }
    
    // Иначе пытаемся загрузить из Minio
    return `http://localhost:9000/test/${patient.Patient_ID}.jpg`;
  };

  const handleImageError = (_e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imageLoadedRef.current) {
      console.log('PatientPage: Image load error, switching to default');
      setImageError(true);
      imageLoadedRef.current = true;
    }
  };

  const handleImageLoad = (_e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('PatientPage: Image loaded successfully');
    imageLoadedRef.current = true;
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
            
            <div className="patient-info-title">
              Информация о пациенте:
              {fromMock}
            </div>
            
            {/* Основной белый блок */}
            <div className="patient-main-card">
              <div className="patient-content-container">
                <div className="patient-photo-name-container">
                  <img 
                    src={getPatientImage()}
                    alt=""
                    className="patient-photo-img"
                    loading="lazy"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};