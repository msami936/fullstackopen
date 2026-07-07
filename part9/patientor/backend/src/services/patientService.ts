import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.ts';
import type { NewPatient, Patient, PublicPatient } from '../types.ts';

const patients: Patient[] = patientData;

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient: Patient = {
    id: uuid(),
    ...newPatient,
  };

  patients.push(patient);
  return patient;
};

export default {
  getPublicPatients,
  addPatient,
};
