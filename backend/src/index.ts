import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; 

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());


const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.get("/", (req, res) => {
  res.send("News Sherlock Backend is running ");
});
app.use('/api/users', userRoutes);
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
