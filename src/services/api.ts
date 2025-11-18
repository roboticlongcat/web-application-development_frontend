import { type Patient } from '../types/patient';

const mockPatients: Patient[] = [
  {
    Patient_ID: 1,
    Name: "Нефедова Екатерина",
    Sensitivity: 1.5,
    Type: 2,
    Glucose: 7.0,
    Description: "нытик",
    Status: "действует",
    PhotoURL: ""
  },
  {
    Patient_ID: 2,
    Name: "Пушкина Светлана",
    Sensitivity: 2.75,
    Type: 1,
    Glucose: 6.5,
    Description: "",
    Status: "действует",
    PhotoURL: ""
  },
  {
    Patient_ID: 3,
    Name: "Четкин Вячеслав",
    Sensitivity: 0.5,
    Type: 2,
    Glucose: 7.2,
    Description: "",
    Status: "действует",
    PhotoURL: ""
  },
  {
    Patient_ID: 4,
    Name: "Быстров Дмитрий",
    Sensitivity: 1.2,
    Type: 1,
    Glucose: 6.8,
    Description: "",
    Status: "действует",
    PhotoURL: ""
  },
  {
    Patient_ID: 5,
    Name: "Забелина Майя",
    Sensitivity: 3.0,
    Type: 2,
    Glucose: 7.1,
    Description: "",
    Status: "действует",
    PhotoURL: ""
  }
];

const API_BASE = '/api';

function transformPatientData(backendData: any): Patient {
  console.log('Transforming patient data:', backendData);
  
  return {
    Patient_ID: backendData.Patient_ID || backendData.patient_id || backendData.id || 0,
    Name: backendData.Name || backendData.name || 'Неизвестно',
    Sensitivity: backendData.Sensitivity || backendData.sensitivity || 0,
    Type: backendData.Type || backendData.type || 1,
    Glucose: backendData.Glucose || backendData.glucose || 0,
    Description: backendData.Description || backendData.description || '',
    Status: backendData.Status || backendData.status || 'действует',
    PhotoURL: backendData.PhotoURL || backendData.photoURL || ''
  };
}

// api.ts
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = window.location.hostname.includes('github.io');

export const patientApi = {
  async getPatients(): Promise<{ patients: Patient[]; fromMock: boolean }> {
    // На GitHub Pages всегда используем мок-данные
    if (isProduction || isGitHubPages) {
      console.log('Using mock data on production/GitHub Pages');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { patients: mockPatients, fromMock: true };
    }

    try {
      console.log('Fetching patients from backend...');
      const response = await fetch(`${API_BASE}/patients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw patients data from backend:', data);
      
      const patients = Array.isArray(data) 
        ? data.map(transformPatientData)
        : data;
      
      console.log('Transformed patients:', patients);
      return { patients, fromMock: false };
    } catch (error) {
      console.warn('Failed to fetch patients from backend, using mock data:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { patients: mockPatients, fromMock: true };
    }
  },

  async getPatientById(id: number): Promise<{ patient: Patient | null; fromMock: boolean }> {
    // На GitHub Pages всегда используем мок-данные
    if (isProduction || isGitHubPages) {
      console.log('Using mock data on production/GitHub Pages for patient:', id);
      await new Promise(resolve => setTimeout(resolve, 300));
      const patient = mockPatients.find(p => p.Patient_ID === id) || null;
      return { patient, fromMock: true };
    }

    try {
      console.log(`Fetching patient ${id} from backend...`);
      const response = await fetch(`${API_BASE}/patients/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { patient: null, fromMock: false };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw patient data from backend:', data);
      
      const patient = transformPatientData(data);
      console.log('Transformed patient:', patient);
      return { patient, fromMock: false };
    } catch (error) {
      console.warn(`Failed to fetch patient ${id} from backend, using mock data:`, error);
      await new Promise(resolve => setTimeout(resolve, 300));
      const patient = mockPatients.find(p => p.Patient_ID === id) || null;
      return { patient, fromMock: true };
    }
  }
};