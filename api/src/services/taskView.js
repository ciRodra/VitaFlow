const { calcularStatus } = require('../utils/status');

// Formato de uma tarefa na resposta da API (ver contrato de dados, seções 5 e 6 do guia).
function serializeTask(task, agora = new Date()) {
  const record = task.record || null;
  const item = task.careItem;
  return {
    id: task.id,
    scheduledDate: task.scheduledDate,
    scheduledTime: task.scheduledTime,
    status: calcularStatus(task, record, agora),
    reason: record ? record.reason || null : null,
    note: record ? record.note || null : null,
    recordedAt: record ? record.recordedAt : null,
    careItemId: item.id,
    title: item.title,
    type: item.type,
    dosageOrRule: item.dosageOrRule,
    origin: item.origin,
    prescribedBy: item.prescribedBy || null,
    educationalNote: item.educationalNote || null,
  };
}

module.exports = { serializeTask };
