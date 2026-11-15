const express = require('express');
const prisma = require('../lib/prisma');
const { gerarTarefas } = require('../services/taskGenerator');
const { serializeTask } = require('../services/taskView');
const { REASONS } = require('../utils/status');
const { today } = require('../utils/dates');

const router = express.Router();

async function buscarTarefa(id) {
  return prisma.scheduledTask.findUnique({
    where: { id },
    include: { record: true, careItem: true },
  });
}

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

// PUT /tasks/:id/record  { status: "DONE" }  ou  { status: "NOT_DONE", reason: "FORGOT" }
router.put('/:id/record', async (req, res) => {
  try {
    const { status, reason, note } = req.body || {};

    if (status !== 'DONE' && status !== 'NOT_DONE') {
      return res.status(400).json({ error: 'O campo status deve ser DONE ou NOT_DONE.' });
    }
    if (status === 'NOT_DONE' && !REASONS.includes(reason)) {
      return res.status(400).json({
        error: `Para NOT_DONE, informe um motivo válido: ${REASONS.join(', ')}.`,
      });
    }

    const task = await buscarTarefa(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

    const data = {
      status,
      reason: status === 'NOT_DONE' ? reason : null,
      note: note || null,
      recordedAt: new Date(),
    };

    await prisma.taskRecord.upsert({
      where: { scheduledTaskId: task.id },
      update: data,
      create: { scheduledTaskId: task.id, ...data },
    });

    res.json(serializeTask(await buscarTarefa(task.id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// DELETE /tasks/:id/record  -> desfaz o registro; a tarefa volta a ter status calculado
router.delete('/:id/record', async (req, res) => {
  try {
    const task = await buscarTarefa(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

    await prisma.taskRecord.deleteMany({ where: { scheduledTaskId: task.id } });

    res.json(serializeTask(await buscarTarefa(task.id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;
