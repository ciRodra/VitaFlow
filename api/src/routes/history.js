const express = require('express');
const prisma = require('../lib/prisma');
const { serializeTask } = require('../services/taskView');
const { lastDays } = require('../utils/dates');

const router = express.Router();

// GET /history?days=7  -> [ { date, tasks: [...] } ], dia mais recente primeiro
router.get('/', async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 365);
    const datas = lastDays(days);

    const tasks = await prisma.scheduledTask.findMany({
      where: { scheduledDate: { in: datas } },
      include: { record: true, careItem: true },
      orderBy: [{ scheduledDate: 'desc' }, { scheduledTime: 'asc' }],
    });

    const agora = new Date();
    const porDia = new Map();
    for (const t of tasks) {
      if (!porDia.has(t.scheduledDate)) porDia.set(t.scheduledDate, []);
      porDia.get(t.scheduledDate).push(serializeTask(t, agora));
    }

    const result = [...porDia.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, list]) => ({ date, tasks: list }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
