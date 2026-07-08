import { isNotNumber } from './utils.ts';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const values = args.slice(2);

  if (values.some((value) => isNotNumber(value))) {
    throw new Error('Provided values were not numbers!');
  }

  const numbers = values.map((value) => Number(value));
  const target = numbers[0];
  const dailyHours = numbers.slice(1);

  if (dailyHours.length < 1) {
    throw new Error('Not enough arguments');
  }

  return { target, dailyHours };
};

export const calculateExercises = (
  dailyHours: number[],
  target: number
): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const average =
    dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (success) {
    rating = 3;
    ratingDescription = 'target reached';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
