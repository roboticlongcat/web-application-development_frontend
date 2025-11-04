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

// Базовый URL для API - через прокси Vite
const API_BASE = '/api';

// Функция для трансформации данных из бэкенда
function transformPatientData(backendData: any): Patient {
  console.log('Transforming patient data:', backendData);
  
  // Если бэкенд использует camelCase или другие названия полей
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

export const patientApi = {
  async getPatients(): Promise<Patient[]> {
    try {
      console.log('Fetching patients from backend...');
      const response = await fetch(`${API_BASE}/patients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw patients data from backend:', data);
      
      // Трансформируем данные если нужно
      const patients = Array.isArray(data) 
        ? data.map(transformPatientData)
        : data;
      
      console.log('Transformed patients:', patients);
      return patients;
    } catch (error) {
      console.warn('Failed to fetch patients from backend, using mock data:', error);
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPatients;
    }
  },

  async getPatientById(id: number): Promise<Patient | null> {
    try {
      console.log(`Fetching patient ${id} from backend...`);
      const response = await fetch(`${API_BASE}/patients/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw patient data from backend:', data);
      
      const patient = transformPatientData(data);
      console.log('Transformed patient:', patient);
      return patient;
    } catch (error) {
      console.warn(`Failed to fetch patient ${id} from backend, using mock data:`, error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPatients.find(patient => patient.Patient_ID === id) || null;
    }
  }
};