import dotenv from 'dotenv';
import z from 'zod';
dotenv.config({ path: './.env' });

const schema = z.object({
  PORT: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
});

const env_variables = schema.parse(process.env);

export const { PORT, MONGODB_URI, AUTH_SECRET } = env_variables;
