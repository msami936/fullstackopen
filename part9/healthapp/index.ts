import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
import { isNotNumber } from './utils.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNotNumber(height) || isNotNumber(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const bmi = calculateBmi(heightNum, weightNum);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (isNotNumber(target)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  if (daily_exercises.some((exercise) => isNotNumber(exercise))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const targetNum = Number(target);
  const dailyExercises = daily_exercises.map((exercise) => Number(exercise));

  const result = calculateExercises(dailyExercises, targetNum);
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
