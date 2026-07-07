import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Female, Male, Wc } from "@mui/icons-material";
import axios from "axios";

import { Gender, type Diagnosis, type NewEntry, type Patient } from "../../types";
import patientService from "../../services/patients";
import AddEntryForm from "./AddEntryForm";
import EntryDetails from "./EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

interface ZodIssue {
  path: (string | number)[];
  message: string;
}

const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};

const getGenderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    case Gender.Other:
      return <Wc />;
    default:
      return assertNever(gender);
  }
};

const formatError = (issues: ZodIssue[]): string => {
  return issues
    .map((issue) => `${String(issue.path[0])}: ${issue.message}`)
    .join(', ');
};

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatient = async (patientId: string) => {
      const patient = await patientService.getById(patientId);
      setPatient(patient);
    };

    if (id) {
      void fetchPatient(id);
    }
  }, [id]);

  const submitNewEntry = async (values: NewEntry) => {
    if (!patient || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const addedEntry = await patientService.addEntry(patient.id, values);

      setPatient((currentPatient) => {
        if (!currentPatient) {
          return currentPatient;
        }

        return {
          ...currentPatient,
          entries: currentPatient.entries.concat(addedEntry),
        };
      });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError<{ error: ZodIssue[] | string }>(e)) {
        const errorData = e.response?.data.error;

        if (Array.isArray(errorData)) {
          setError(formatError(errorData));
        } else if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError('Unknown error');
        }
      } else {
        setError('Unknown error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!patient) {
    return null;
  }

  return (
    <div>
      <Typography variant="h4">
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      <Typography variant="body1">date of birth: {patient.dateOfBirth}</Typography>
      <Typography variant="h6">entries</Typography>
      <div>
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </div>
      {!showForm && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setShowForm(true)}
        >
          ADD NEW ENTRY
        </Button>
      )}
      {showForm && (
        <AddEntryForm
          diagnoses={diagnoses}
          onSubmit={(values) => void submitNewEntry(values)}
          onCancel={() => {
            setShowForm(false);
            setError(undefined);
          }}
          error={error}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default PatientPage;
