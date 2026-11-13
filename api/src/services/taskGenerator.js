const prisma = require('../lib/prisma');
const { formatDate, toDate, addDays } = require('../utils/dates');

// Nome do campo que liga CareItem ao TreatmentPlan no schema.prisma da Bruh (treatmentPlanId ou planId).
const PLAN_FK = 'treatmentPlanId';

/**
 * Gera as ScheduledTask de um plano, para cada dia entre dataInicio e dataFim (inclusive).
 * Idempotente: usa upsert na chave única (careItemId, scheduledDate, scheduledTime).
 * Aceita datas como "YYYY-MM-DD" ou Date.
 */
async function gerarTarefas(planId, dataInicio, dataFim) {
  const items = await prisma.careItem.findMany({
    where: { [PLAN_FK]: planId, active: true },
  });

  const inicio = toDate(dataInicio);
  const fim = toDate(dataFim);
  const criadas = [];

  for (let d = inicio; d <= fim; d = addDays(d, 1)) {
    const scheduledDate = formatDate(d);

    for (const item of items) {
      let horarios = [];
      try {
        horarios = JSON.parse(item.scheduleTimes); // ex.: '["08:00"]'
      } catch {
        horarios = [];
      }

      for (const scheduledTime of horarios) {
        const task = await prisma.scheduledTask.upsert({
          where: {
            careItemId_scheduledDate_scheduledTime: {
              careItemId: item.id,
              scheduledDate,
              scheduledTime,
            },
          },
          update: {},
          create: { careItemId: item.id, scheduledDate, scheduledTime },
        });
        criadas.push(task);
      }
    }
  }

  return criadas;
}

/** Atalho: de (hoje - 6) até hoje, os 7 dias do vídeo. */
async function gerarUltimos7Dias(planId) {
  return gerarTarefas(planId, addDays(new Date(), -6), new Date());
}

module.exports = { gerarTarefas, gerarUltimos7Dias };
