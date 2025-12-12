import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config();

// DEBUG: Check if .env loaded and what the URL is
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