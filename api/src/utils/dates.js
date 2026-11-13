// Datas sempre como string "YYYY-MM-DD" no fuso local (evita o bug do toISOString/UTC).
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toDate(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const [y, m, d] = String(value).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(value, n) {
  const d = toDate(value);
  d.setDate(d.getDate() + n);
  return d;
}

function today() {
  return formatDate(new Date());
}

// Lista de datas de (hoje - (days-1)) até hoje
function lastDays(days) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) out.push(formatDate(addDays(new Date(), -i)));
  return out;
}

module.exports = { formatDate, toDate, addDays, today, lastDays };
