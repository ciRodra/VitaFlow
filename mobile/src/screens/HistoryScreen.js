import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, statusStyles } from '../theme/colors';
import { getHistory } from '../services/api';
import { mockTasks } from '../mocks/tasks';
import { REASON_LABELS } from '../constants/reasons';
import { shortDay, todayKey } from '../utils/dates';
import OfflineNotice from '../components/OfflineNotice';

const FILTERS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: 'Todos', days: 365 },
];

function detailFor(task) {
  if (task.status === 'NOT_DONE') {
    const reason = `Motivo: ${REASON_LABELS[task.reason] || 'não informado'}`;
    return task.note ? `${reason} · “${task.note}”` : reason;
  }
  if (task.status === 'DONE') return 'Registrado como feito';
  if (task.status === 'NO_RESPONSE') return 'Nenhum registro';
  return 'Aguardando o horário';
}

function DaySummary({ tasks }) {
  const count = (status) => tasks.filter((t) => t.status === status).length;
  const parts = [
    count('DONE') && `✓ ${count('DONE')}`,
    count('NOT_DONE') && `✕ ${count('NOT_DONE')}`,
    count('NO_RESPONSE') && `— ${count('NO_RESPONSE')}`,
    count('PENDING') && `◷ ${count('PENDING')}`,
  ].filter(Boolean);
  return <Text style={styles.daySummary}>{parts.join('  ·  ')}</Text>;
}

export default function HistoryScreen() {
  const [days, setDays] = useState(7);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHistory(days)
      .then((data) => {
        setHistory(data);
        setOffline(false);
      })
      .catch(() => {
        setHistory([{ date: todayKey(), tasks: mockTasks }]);
        setOffline(true);
      })
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>O que aconteceu com cada tarefa, dia a dia.</Text>

      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const isActive = filter.days === days;
          return (
            <Pressable
              key={filter.label}
              onPress={() => setDays(filter.days)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.filter, isActive && styles.filterActive]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {offline && <OfflineNotice />}
      {loading && <ActivityIndicator color={colors.text} />}

      {!loading && history.length === 0 && (
        <Text style={styles.empty}>Nenhuma tarefa neste período.</Text>
      )}

      {history.map((day) => (
        <View key={day.date} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>
              {day.date === todayKey() ? `Hoje · ${shortDay(day.date)}` : shortDay(day.date)}
            </Text>
            <DaySummary tasks={day.tasks} />
          </View>

          {day.tasks.map((task) => {
            const style = statusStyles[task.status];
            return (
              <View
                key={task.id}
                style={styles.row}
                accessible
                accessibilityLabel={`${task.scheduledTime}, ${task.title}: ${style.label.slice(2)}. ${detailFor(task)}`}
              >
                <Text style={styles.time}>{task.scheduledTime}</Text>
                <View style={styles.rowBody}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.detail}>{detailFor(task)}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: style.bg }]}>
                  <Text style={[styles.pillText, { color: style.fg }]}>{style.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      <Text style={styles.notice}>
        “Sem registro” quer dizer apenas que nada foi informado.{'\n'}
        Não significa que a tarefa deixou de ser feita.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 12, padding: 18, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.muted },
  filters: { flexDirection: 'row', gap: 8 },
  filter: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  filterActive: { borderColor: colors.text, backgroundColor: colors.text },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.text },
  filterTextActive: { color: colors.surface },
  empty: { fontSize: 13, color: colors.muted },
  dayCard: {
    gap: 4,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dayTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  daySummary: { fontSize: 11.5, color: colors.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  time: { width: 42, fontSize: 12, fontWeight: '600', color: colors.muted },
  rowBody: { flex: 1, gap: 1 },
  taskTitle: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  detail: { fontSize: 11.5, color: colors.muted },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  pillText: { fontSize: 10.5, fontWeight: '700' },
  notice: { fontSize: 11.5, lineHeight: 17, textAlign: 'center', color: colors.muted },
});
