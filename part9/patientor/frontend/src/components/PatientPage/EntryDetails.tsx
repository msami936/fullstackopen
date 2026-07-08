import { Card, CardContent, Typography } from "@mui/material";
import { LocalHospital, MedicalServices, Work } from "@mui/icons-material";

import HealthRatingBar from "../HealthRatingBar";
import {
  type Diagnosis,
  type Entry,
} from "../../types";

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};

const getDiagnosisName = (code: string, diagnoses: Diagnosis[]): string => {
  const diagnosis = diagnoses.find((d) => d.code === code);
  return diagnosis ? diagnosis.name : '';
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <MedicalServices />
            </Typography>
            <Typography variant="body1">
              <i>{entry.description}</i>
            </Typography>
            <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
            <Typography variant="body1">diagnose by {entry.specialist}</Typography>
          </CardContent>
        </Card>
      );
    case 'OccupationalHealthcare':
      return (
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <Work /> <i>{entry.employerName}</i>
            </Typography>
            <Typography variant="body1">
              <i>{entry.description}</i>
            </Typography>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>
                  {code} {getDiagnosisName(code, diagnoses)}
                </li>
              ))}
            </ul>
            {entry.sickLeave && (
              <Typography variant="body1">
                sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
              </Typography>
            )}
            <Typography variant="body1">diagnose by {entry.specialist}</Typography>
          </CardContent>
        </Card>
      );
    case 'Hospital':
      return (
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <LocalHospital />
            </Typography>
            <Typography variant="body1">
              <i>{entry.description}</i>
            </Typography>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li key={code}>
                  {code} {getDiagnosisName(code, diagnoses)}
                </li>
              ))}
            </ul>
            <Typography variant="body1">
              discharge: {entry.discharge.date} {entry.discharge.criteria}
            </Typography>
            <Typography variant="body1">diagnose by {entry.specialist}</Typography>
          </CardContent>
        </Card>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
