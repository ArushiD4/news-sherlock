import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
}
console.log("DEBUG: Current DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});