import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPatients } from '../slices/patientsSlice';
import { setSearchTerm } from '../slices/filtersSlice';
import { type Patient } from '../types/patient';
import './Patients.css';
import { IMAGE_BASE_URL } from '../config';

export const PatientsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { items: patients, loading, error, fromMock } = useAppSelector((state) => state.patients);
  const { searchTerm } = useAppSelector((state) => state.filters);
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredPatients = patients.filter(patient =>
    patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    dispatch(setSearchTerm(localSearchTerm));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBasketAction = (): number => {
    const count_patients = 0;
    const result = count_patients >= 0 ? 0 : -1;
    console.log(`Метод корзины вызван, результат: ${result}`);
    return result;
  };

  // Функция для получения картинки пациента
  const getPatientImage = (patient: Patient) => {
    if (fromMock) {
      // Если используем мок данные - сразу дефолтная картинка
      return './default-patient.png';
    } else {
      // Если данные из БД - пытаемся загрузить из Minio
      return `${IMAGE_BASE_URL}/${patient.Patient_ID}.jpg`;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Если ошибка загрузки из Minio - показываем дефолтную картинку
    e.currentTarget.src = './default-patient.png';
    e.currentTarget.onerror = null;
  };

  if (loading) {
    return (
      <div className="patients-page">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="text-center py-5">
                <div className="loading-spinner"></div>
                <p className="mt-3">Загрузка пациентов...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patients-page">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="error-message text-center py-5">
                <p>Ошибка загрузки пациентов: {error}</p>
                <Button 
                  variant="primary" 
                  onClick={() => dispatch(fetchPatients())}
                  className="medical-btn-primary"
                >
                  Попробовать снова
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="patients-page">
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="patients-header">
              <h1 className="patients-title">Пациенты</h1>
              {fromMock}
            </div>

            <div className="search-patients-container">
              <InputGroup className="search-patients-input">
                <Form.Control
                  type="text"
                  placeholder="Поиск пациентов по имени..."
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  variant="outline-primary"
                  onClick={handleSearch}
                  className="search-patients-button"
                  disabled={loading}
                >
                  <div className="search-patients-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M11 11L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </Button>
              </InputGroup>
            </div>

            <div className="patients-grid">
              {filteredPatients.map(patient => (
                <Link 
                  to={`/patients/${patient.Patient_ID}`} 
                  key={patient.Patient_ID} 
                  className="patient-card"
                >
                  <div className="patient-card-content">
                    <div className="patient-image-container">
                      <img 
                        src={getPatientImage(patient)}
                        alt=""
                        className="patient-image"
                        loading="lazy"
                        onError={fromMock ? undefined : handleImageError}
                      />
                    </div>
                    
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

            {filteredPatients.length === 0 && (
              <div className="text-center mt-5">
                {patients.length === 0 ? (
                  <div className="no-patients">
                    <p className="no-patients-text">Нет пациентов в базе данных</p>
                  </div>
                ) : (
                  <div className="no-search-results">
                    <p className="no-results-text">Пациенты не найдены</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setLocalSearchTerm('');
                        dispatch(setSearchTerm(''));
                      }}
                      className="show-all-button"
                    >
                      Показать всех пациентов
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    {/* Иконка калькулятора */}
      <div className="calculation-icon">
          <svg width="44" height="47" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H40V41H4V12Z" fill="#00a9bf"/>
            <path d="M4 12H40V17H4V12Z" fill="#00a9bf"/>
            <path d="M12 6H32V12H12V6Z" fill="#00a9bf"/>
          </svg>
          {/* Количество пациентов = 0, т.к. заявки нет */}
          <span className="calculation-count">{handleBasketAction()}</span>
      </div>
    </div>
  );
};