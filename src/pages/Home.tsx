import { type FC } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ROUTES } from "../Routes";
import './Home.css';

export const HomePage: FC = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xl={10}>
              <div className="hero-content">
                <h1 className="hero-title">Калькулятор болюсного инсулина</h1>
                <p className="hero-subtitle">
                  Профессиональная система управления пациентами с диабетом 
                  и расчета дозы болюсного инсулина на основе индивидуальных коэффициентов чувствительности
                </p>
                <div className="hero-actions">
                  <Link to={ROUTES.Patients}>
                    <Button variant="primary" className="medical-btn-primary">
                      Просмотреть пациентов
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xl={10}>
              <div className="features-container">
                <h2 className="section-title">Возможности системы</h2>
                
                <div className="features-grid">
                  <div className="feature-card">
                    <div>
                      <span className="feature-icon">👥</span>
                      <h3 className="feature-card-title">Управление пациентами</h3>
                      <p className="feature-card-text">
                        Ведение базы пациентов с индивидуальными коэффициентами чувствительности 
                        и персональными настройками терапии
                      </p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div>
                      <span className="feature-icon">📊</span>
                      <h3 className="feature-card-title">Индивидуальный подход</h3>
                      <p className="feature-card-text">
                        Учет персональной чувствительности к инсулину для каждого пациента 
                        с возможностью тонкой настройки параметров
                      </p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div>
                      <span className="feature-icon">⚡</span>
                      <h3 className="feature-card-title">Быстрый доступ</h3>
                      <p className="feature-card-text">
                        Удобный интерфейс для быстрого поиска пациентов и доступа 
                        к их медицинским данным в любое время
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};