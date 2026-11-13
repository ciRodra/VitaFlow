const express = require('express');
const prisma = require('../lib/prisma');
const { calcularStatus } = require('../utils/status');
const { gerarTarefas } = require('../services/taskGenerator');
const { lastDays, today } = require('../utils/dates');

const router = express.Router();

// Fração de 0 a 1 (ex.: 0.88). A tela Progresso é quem multiplica por 100.
const ratio = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 10000) / 10000);

// GET /progress?days=7
// registrationRate = (DONE + NOT_DONE) / (DONE + NOT_DONE + NO_RESPONSE)   -> pendentes ficam fora
// completionRate   = DONE / (DONE + NOT_DONE)
router.get('/', async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 365);
    const datas = lastDays(days);

    // Garante as tarefas de hoje mesmo se o Progresso abrir antes da tela Hoje (idempotente).
    const hoje = today();
    const plan = await prisma.treatmentPlan.findFirst({ where: { active: true } });
    if (plan) await gerarTarefas(plan.id, hoje, hoje);

    const tasks = await prisma.scheduledTask.findMany({
      where: { scheduledDate: { in: datas } },
      include: { record: true },
    });

    const agora = new Date();
    const total = { done: 0, notDone: 0, noResponse: 0, pending: 0 };
    const breakdown = new Map(
      datas.map((d) => [d, { date: d, done: 0, notDone: 0, noResponse: 0, pending: 0 }])
    );

    for (const t of tasks) {
      const status = calcularStatus(t, t.record, agora);
      const key = { DONE: 'done', NOT_DONE: 'notDone', NO_RESPONSE: 'noResponse', PENDING: 'pending' }[status];
      total[key]++;
      breakdown.get(t.scheduledDate)[key]++;
    }

    const registered = total.done + total.notDone;
    const considered = registered + total.noResponse;

    res.json({
      days,
      totalTasks: tasks.length, // inclui as pendentes
      done: total.done,
      notDone: total.notDone,
      noResponse: total.noResponse,
      pending: total.pending,
      registrationRate: ratio(registered, considered),
      completionRate: ratio(total.done, registered),
      dailyBreakdown: datas.map((d) => breakdown.get(d)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
