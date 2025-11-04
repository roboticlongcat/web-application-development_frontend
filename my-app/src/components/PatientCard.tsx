import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { type Patient } from '../types/patient';
import './PatientCard.css';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: FC<PatientCardProps> = ({ patient }) => {
  return (
    <Link to={`/patients/${patient.Patient_ID}`} className="patient-card-link">
      <div className="patient-card">
        <div className="patient-name">{patient.Name}</div>
        <div className="sensitivity-section">
          <div className="sensitivity-label">Коэффициент чувствительности:</div>
          <div className="sensitivity-value">{patient.Sensitivity}</div>
        </div>
        <hr className="card-divider" />
      </div>
    </Link>
  );
};