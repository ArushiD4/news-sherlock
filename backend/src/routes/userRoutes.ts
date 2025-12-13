import { Router } from 'express';
//import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
//const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  return res.status(201).json({
    success: true,
    user: {
      id: 1,
      email,
      name,
      refId: "REF-DEMO",
      createdAt: new Date()
    }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  return res.json({
    success: true,
    user: {
      id: 1,
      email,
      name: "Demo User",
      refId: "REF-DEMO"
    }
  });
});

export default router;
