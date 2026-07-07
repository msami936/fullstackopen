import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';
import { apiBaseUrl } from '../constants';

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(
    `${apiBaseUrl}/diaries`
  );

  return data;
};

const create = async (object: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(
    `${apiBaseUrl}/diaries`,
    object
  );

  return data;
};

export default {
  getAll,
  create,
};
