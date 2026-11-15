// Motivos de "Não realizei" (códigos do contrato da API).
export const REASONS = [
  { code: 'FORGOT', label: 'Esqueci' },
  { code: 'NO_MEDICATION', label: 'Não consegui obter o medicamento' },
  { code: 'DID_NOT_UNDERSTAND', label: 'Não entendi a orientação' },
  { code: 'CHOSE_NOT_TO', label: 'Preferi não realizar' },
  { code: 'OTHER', label: 'Outro motivo' },
  { code: 'PREFER_NOT_TO_SAY', label: 'Prefiro não informar' },
];

export const REASON_LABELS = Object.fromEntries(REASONS.map((r) => [r.code, r.label]));
