import { type FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../Routes';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export const Breadcrumbs: FC = () => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', href: ROUTES.Home }
    ];

    if (pathnames.length === 0) {
      return breadcrumbs;
    }

    // Обрабатываем страницу пациентов
    if (pathnames[0] === 'patients') {
      breadcrumbs.push({ label: 'Пациенты', href: ROUTES.Patients });
      
      // Если есть ID пациента (второй элемент в pathnames)
      if (pathnames[1]) {
        breadcrumbs.push({ label: 'Карточка пациента', active: true });
      }
    }

    // Обрабатываем страницу калькулятора
    if (pathnames[0] === 'calculator') {
      breadcrumbs.push({ label: 'Калькулятор инсулина', active: true });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="breadcrumbs-container">
      <Container>
        <Breadcrumb className="medical-breadcrumb">
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item
              key={index}
              linkAs={Link}
              linkProps={{ to: item.href || '#' }}
              active={item.active}
              className="breadcrumb-item"
            >
              {item.label}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </Container>
    </div>
  );
};