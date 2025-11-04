import { type FC } from 'react';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../Routes';
import './Navbar.css';

export const Navbar: FC = () => {
  const location = useLocation();

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" className="medical-navbar">
      <Container>
        <BSNavbar.Brand as={Link} to={ROUTES.Home} className="navbar-brand">
          <svg 
            width="32" 
            height="20" 
            viewBox="0 0 32 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="navbar-icon"
          >
            <path 
              d="M2 10L4 10L6 6L8 14L10 10L12 10L14 4L16 16L18 10L20 10L22 8L24 12L26 10L28 10L30 2" 
              stroke="#FFFFFF" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          ИнсулинКальк
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to={ROUTES.Patients}
              className={location.pathname === ROUTES.Patients ? 'nav-link active' : 'nav-link'}
            >
              Пациенты
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};