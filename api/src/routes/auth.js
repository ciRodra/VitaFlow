const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /auth/login  { email, isDemo: true }  ->  { token: "demo-token", user }
router.post('/login', async (req, res) => {
  try {
    const { email, isDemo } = req.body || {};
    if (!isDemo) return res.status(400).json({ error: 'Apenas o login de demonstração está disponível.' });

    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findFirst({ where: { isDemo: true } });

    if (!user || !user.isDemo) return res.status(404).json({ error: 'Conta de demonstração não encontrada.' });

    const { passwordHash, ...safeUser } = user;
    res.json({ token: 'demo-token', user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
