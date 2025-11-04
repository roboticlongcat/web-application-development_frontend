import { type FC } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../Routes';
import './Header.css';

const Header: FC = () => {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="medical-header">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.Home}>
          🩺 ИнсулинКальк
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to={ROUTES.Home}
              className={location.pathname === ROUTES.Home ? 'active' : ''}
            >
              Главная
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to={ROUTES.Patients}
              className={location.pathname === ROUTES.Patients ? 'active' : ''}
            >
              Пациенты
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;