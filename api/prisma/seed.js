// Popula o banco com a demonstração do VitaFlow. Todos os dados são fictícios.
// Rodar de dentro da pasta api/:  npm run seed
// Rode de novo no dia da apresentação: as datas são calculadas a partir de "hoje".
require('dotenv').config();

const prisma = require('../src/lib/prisma');
const { gerarTarefas } = require('../src/services/taskGenerator');
const { addDays } = require('../src/utils/dates');
const { criarRegistrosDemo } = require('./seedRecords');

const NOTA_CAMINHADA =
  'Atividade regular apoia o cuidado contínuo. Alerta: pare se houver tontura, dor no peito ou falta de ar. Conteúdo informativo (Ministério da Saúde).';

// Prescrição simulada: os horários e itens variam conforme o prontuário enviado pela rede médica.
const ITENS = [
  {
    title: 'Medicamento A',
    type: 'MEDICATION',
    dosageOrRule: '1 comprimido',
    scheduleTimes: ['08:00'],
    origin: 'PRESCRIPTION',
  },
  {
    title: 'Aferição de pressão',
    type: 'MEASUREMENT',
    dosageOrRule: '1 vez ao dia',
    scheduleTimes: ['10:00'],
    origin: 'PROFESSIONAL',
  },
  {
    title: 'Caminhada leve',
    type: 'HABIT',
    dosageOrRule: '30 min em ritmo confortável',
    scheduleTimes: ['18:00'],
    origin: 'PROFESSIONAL',
    educationalNote: NOTA_CAMINHADA,
  },
  {
    title: 'Medicamento B',
    type: 'MEDICATION',
    dosageOrRule: '1 comprimido',
    scheduleTimes: ['22:00'],
    origin: 'PRESCRIPTION',
  },
];

async function main() {
  // Limpa na ordem inversa das relações.
  await prisma.taskRecord.deleteMany();
  await prisma.scheduledTask.deleteMany();
  await prisma.careItem.deleteMany();
  await prisma.treatmentPlan.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'Ana',
      email: 'ana.demo@vitaflow.app',
      passwordHash: 'conta-de-demonstracao',
      isDemo: true,
    },
  });

  const plan = await prisma.treatmentPlan.create({
    data: {
      userId: user.id,
      title: 'Acompanhamento contínuo (fictício)',
      doctorName: 'Dra. Helena Costa (fictícia)',
      notes: 'Prescrição simulada para demonstração. Não há dados reais de pacientes.',
      active: true,
    },
  });

  for (const item of ITENS) {
    await prisma.careItem.create({
      data: {
        treatmentPlanId: plan.id,
        title: item.title,
        type: item.type,
        dosageOrRule: item.dosageOrRule,
        scheduleTimes: JSON.stringify(item.scheduleTimes),
        origin: item.origin,
        prescribedBy: 'Dra. Helena Costa (fictícia)',
        educationalNote: item.educationalNote || null,
        active: true,
      },
    });
  }

  // 7 dias (6 passados + hoje) x 4 itens = 28 tarefas.
  const tarefas = await gerarTarefas(plan.id, addDays(new Date(), -6), new Date());
  await criarRegistrosDemo(prisma);

  const registros = await prisma.taskRecord.count();
  console.log(`Seed concluído: ${tarefas.length} tarefas e ${registros} registros de demonstração.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
