// Comunicação do app com a API do VitaFlow.
// No navegador (expo start --web), localhost funciona.
// No celular com Expo Go, troque localhost pelo IP do computador na mesma rede (ex.: http://192.168.0.10:3333).
export const API_URL = 'http://localhost:3333';

const DEMO_EMAIL = 'ana.demo@vitaflow.app';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error((body && body.error) || `Erro ${response.status} na API`);
  }
  return body;
}

export function login(email = DEMO_EMAIL) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, isDemo: true }),
  });
}

export function getTasks() {
  return request('/tasks');
}

export function saveRecord(taskId, status, reason) {
  const body = status === 'NOT_DONE' ? { status, reason } : { status };
  return request(`/tasks/${taskId}/record`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function undoRecord(taskId) {
  return request(`/tasks/${taskId}/record`, { method: 'DELETE' });
}

export function getHistory(days = 7) {
  return request(`/history?days=${days}`);
}

export function getProgress(days = 7) {
  return request(`/progress?days=${days}`);
}
