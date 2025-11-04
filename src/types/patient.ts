export interface Patient {
  Patient_ID: number;
  Name: string;
  Sensitivity: number;
  Type: number;
  Glucose: number;
  Description: string;
  Status: 'удален' | 'действует';
  PhotoURL: string;
}