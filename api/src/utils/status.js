// Regra de status (Sem registro só 1 hora depois do horário previsto) e motivos aceitos.
const REASONS = [
  'FORGOT',
  'NO_MEDICATION',
  'DID_NOT_UNDERSTAND',
  'CHOSE_NOT_TO',
  'OTHER',
  'PREFER_NOT_TO_SAY',
];

function calcularStatus(task, record, agora = new Date()) {
  if (record) return record.status; // DONE | NOT_DONE
  const [h, m] = task.scheduledTime.split(':').map(Number);
  const [y, mo, d] = task.scheduledDate.split('-').map(Number);
  const limite = new Date(y, mo - 1, d, h, m).getTime() + 60 * 60 * 1000; // horário + 1h
  return agora.getTime() > limite ? 'NO_RESPONSE' : 'PENDING';
}

module.exports = { calcularStatus, REASONS };
