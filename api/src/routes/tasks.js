const express = require('express');
const prisma = require('../lib/prisma');
const { gerarTarefas } = require('../services/taskGenerator');
const { serializeTask } = require('../services/taskView');
const { today } = require('../utils/dates');

const router = express.Router();

// GET /tasks  -> tarefas de hoje, com status calculado
// TODO (pós-MVP): o contrato prevê ?date=YYYY-MM-DD; por ora sempre usa hoje.
router.get('/', async (req, res) => {
  try {
    const hoje = today();

    // Garante que as tarefas de hoje existam (idempotente), útil se o seed for antigo.
    const plan = await prisma.treatmentPlan.findFirst({ where: { active: true } });
    if (plan) await gerarTarefas(plan.id, hoje, hoje);

    const tasks = await prisma.scheduledTask.findMany({
      where: { scheduledDate: hoje },
      include: { record: true, careItem: true },
      orderBy: { scheduledTime: 'asc' },
    });

    const agora = new Date();
    res.json(tasks.map((t) => serializeTask(t, agora)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
