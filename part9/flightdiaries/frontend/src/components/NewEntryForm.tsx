import { useState, type FormEvent } from 'react';
import axios from 'axios';
import diaryService from '../services/diaries';
import { Visibility, Weather, type NewDiaryEntry, type NonSensitiveDiaryEntry } from '../types';

interface NewEntryFormProps {
  onAdd: (entry: NonSensitiveDiaryEntry) => void;
}

interface ErrorResponse {
  error: string | { message: string }[];
}

const NewEntryForm = ({ onAdd }: NewEntryFormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Ok);
  const [weather, setWeather] = useState<Weather>(Weather.Rainy);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment,
    };

    try {
      const addedEntry = await diaryService.create(newEntry);
      onAdd({
        id: addedEntry.id,
        date: addedEntry.date,
        weather: addedEntry.weather,
        visibility: addedEntry.visibility,
      });

      setDate('');
      setVisibility(Visibility.Ok);
      setWeather(Weather.Rainy);
      setComment('');
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError<ErrorResponse>(e)) {
        const errorData = e.response?.data.error;

        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (Array.isArray(errorData)) {
          setError(errorData[0].message);
        } else {
          setError('Unknown error');
        }
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error !== undefined && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={(event) => void submit(event)}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          visibility
          {Object.values(Visibility).map((value) => (
            <label key={value}>
              {value}
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={() => setVisibility(value)}
              />
            </label>
          ))}
        </div>
        <div>
          weather
          {Object.values(Weather).map((value) => (
            <label key={value}>
              {value}
              <input
                type="radio"
                name="weather"
                value={value}
                checked={weather === value}
                onChange={() => setWeather(value)}
              />
            </label>
          ))}
        </div>
        <div>
          comment
          <input value={comment} onChange={(event) => setComment(event.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
