import { useEffect, useState } from 'react';
import DiaryList from './components/DiaryList';
import NewEntryForm from './components/NewEntryForm';
import diaryService from './services/diaries';
import type { NonSensitiveDiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const entries = await diaryService.getAll();
      setDiaries(entries);
    };

    void fetchDiaries();
  }, []);

  const addDiary = (entry: NonSensitiveDiaryEntry) => {
    setDiaries(diaries.concat(entry));
  };

  return (
    <div>
      <NewEntryForm onAdd={addDiary} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
