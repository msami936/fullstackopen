import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients.ts';
import type { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types.ts';

const patients: Patient[] = structuredClone(patientData);

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient: Patient = {
    id: uuid(),
    entries: [],
    ...newPatient,
  };

  patients.push(patient);
  return patient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry,
};
