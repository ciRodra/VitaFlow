// PLACEHOLDER temporário seguindo a tabela da etapa 2A.
// O Lucas é o dono deste arquivo: ao juntar na main, ficar com a versão DELE.
const REASONS = ['FORGOT', 'NO_MEDICATION', 'DID_NOT_UNDERSTAND', 'CHOSE_NOT_TO', 'OTHER']; // contrato

function calcularStatus(task, record, agora = new Date()) {
  if (record) return record.status; // DONE | NOT_DONE
  const [h, m] = task.scheduledTime.split(':').map(Number);
  const [y, mo, d] = task.scheduledDate.split('-').map(Number);
  const limite = new Date(y, mo - 1, d, h, m).getTime() + 60 * 60 * 1000; // horário + 1h
  return agora.getTime() > limite ? 'NO_RESPONSE' : 'PENDING';
}

module.exports = { calcularStatus, REASONS };
