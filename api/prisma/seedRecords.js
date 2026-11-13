// Cria registros fictícios para o vídeo. A Bruh chama isto no FINAL do seed.js:
//
//   const { gerarTarefas } = require('../src/services/taskGenerator');
//   const { criarRegistrosDemo } = require('./seedRecords');
//   ...
//   await gerarTarefas(plan.id, addDays(new Date(), -6), new Date());
//   await criarRegistrosDemo(prisma);
//
// Resultado: 6 dias passados x 4 itens = 24 tarefas -> 19 DONE, 3 NOT_DONE (com motivo), 2 sem registro.
// Hoje: Medicamento A = DONE.
const { today } = require('../src/utils/dates');

const NOT_DONE = { 14: 'CHOSE_NOT_TO', 19: 'NO_MEDICATION', 21: 'FORGOT' }; // posição -> motivo (códigos do contrato)
const NO_RECORD = [5, 23];

async function criarRegistrosDemo(prisma) {
  const hoje = today();

  const passadas = await prisma.scheduledTask.findMany({
    where: { scheduledDate: { lt: hoje } },
    orderBy: [{ scheduledDate: 'asc' }, { scheduledTime: 'asc' }],
  });

  for (let i = 0; i < passadas.length; i++) {
    if (NO_RECORD.includes(i)) continue;
    const reason = NOT_DONE[i];
    await prisma.taskRecord.upsert({
      where: { scheduledTaskId: passadas[i].id },
      update: {},
      create: {
        scheduledTaskId: passadas[i].id,
        status: reason ? 'NOT_DONE' : 'DONE',
        reason: reason || null,
      },
    });
  }

  const medA = await prisma.scheduledTask.findFirst({
    where: { scheduledDate: hoje, careItem: { title: { contains: 'Medicamento A' } } },
  });
  if (medA) {
    await prisma.taskRecord.upsert({
      where: { scheduledTaskId: medA.id },
      update: {},
      create: { scheduledTaskId: medA.id, status: 'DONE' },
    });
  }
}

module.exports = { criarRegistrosDemo };
