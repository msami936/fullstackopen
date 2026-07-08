import { type Request, type Response, type NextFunction } from 'express';
import { NewEntrySchema } from './types.ts';
import { z } from 'zod';

export const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    const first = error.issues[0];

    if (first.code === 'invalid_value') {
      const field = first.path[0];

      if (field === 'visibility') {
        res.status(400).send({ error: `Incorrect visibility: ${String(first.input)}` });
        return;
      }

      if (field === 'weather') {
        res.status(400).send({ error: `Incorrect weather: ${String(first.input)}` });
        return;
      }
    }

    res.status(400).send({ error: first.message });
  } else {
    next(error);
  }
};
