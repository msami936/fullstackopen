import { useState, type SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import {
  HealthCheckRating,
  type Diagnosis,
  type NewEntry,
} from "../../types";

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  error?: string;
  isSubmitting?: boolean;
}

type EntryType = NewEntry['type'];

interface EntryTypeOption {
  value: EntryType;
  label: string;
}

interface HealthRatingOption {
  value: HealthCheckRating;
  label: string;
}

const entryTypeOptions: EntryTypeOption[] = [
  { value: 'HealthCheck', label: 'Health Check' },
  { value: 'OccupationalHealthcare', label: 'Occupational Healthcare' },
  { value: 'Hospital', label: 'Hospital' },
];

const healthRatingOptions: HealthRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: '0 — Healthy' },
  { value: HealthCheckRating.LowRisk, label: '1 — Low Risk' },
  { value: HealthCheckRating.HighRisk, label: '2 — High Risk' },
  { value: HealthCheckRating.CriticalRisk, label: '3 — Critical Risk' },
];

const AddEntryForm = ({ diagnoses, onSubmit, onCancel, error, isSubmitting = false }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const onEntryTypeChange = (event: SelectChangeEvent<EntryType>) => {
    setEntryType(event.target.value as EntryType);
  };

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const onHealthRatingChange = (event: SelectChangeEvent<HealthCheckRating>) => {
    setHealthCheckRating(event.target.value as HealthCheckRating);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      date,
      description,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    switch (entryType) {
      case 'HealthCheck':
        onSubmit({
          type: 'HealthCheck',
          ...baseEntry,
          healthCheckRating,
        });
        break;
      case 'OccupationalHealthcare':
        onSubmit({
          type: 'OccupationalHealthcare',
          ...baseEntry,
          employerName,
          sickLeave:
            sickLeaveStart.length > 0 && sickLeaveEnd.length > 0
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined,
        });
        break;
      case 'Hospital':
        onSubmit({
          type: 'Hospital',
          ...baseEntry,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
    }
  };

  return (
    <Box
      sx={{
        border: '1px dashed grey',
        borderRadius: 1,
        p: 2,
        mt: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Entry
      </Typography>
      {error !== undefined && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={addEntry}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="entry-type-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-label"
            label="Entry type"
            value={entryType}
            onChange={onEntryTypeChange}
          >
            {entryTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          required
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          required
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Specialist"
          required
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={onDiagnosisChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((code) => (
                  <Chip key={code} label={code} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} — {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {entryType === 'HealthCheck' && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="health-rating-label">Health Check Rating</InputLabel>
            <Select
              labelId="health-rating-label"
              label="Health Check Rating"
              value={healthCheckRating}
              onChange={onHealthRatingChange}
            >
              {healthRatingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer name"
              required
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Sick leave start date"
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Sick leave end date"
              type="date"
              fullWidth
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 2 }}
            />
          </>
        )}
        {entryType === 'Hospital' && (
          <>
            <TextField
              label="Discharge date"
              type="date"
              required
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Discharge criteria"
              required
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          ADD
        </Button>
        <Button
          type="button"
          variant="outlined"
          sx={{ ml: 1 }}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          CANCEL
        </Button>
      </form>
    </Box>
  );
};

export default AddEntryForm;
