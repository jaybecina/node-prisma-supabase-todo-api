import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { apiLimiter } from './middleware/rateLimiter';
import prisma from './config/prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Test database connection
console.log('Testing database connection...');
prisma
  .$connect()
  .then(() => {
    console.log('Successfully connected to Prisma');
  })
  .catch((error) => {
    console.error('Failed to connect to Prisma:', error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(apiLimiter);

// Routes
app.use('/api', routes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
