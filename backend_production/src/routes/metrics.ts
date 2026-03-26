import express, { Request, Response } from 'express';
import { register } from '../utils/metrics';

export const metricsRouter = express.Router();

// Prometheus metrics endpoint
metricsRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end();
  }
});
