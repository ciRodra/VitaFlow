import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockTasks } from '../mocks/tasks';
import { getTasks, saveRecord, undoRecord } from '../services/api';
import { REASON_LABELS } from '../constants/reasons';
import { longDate } from '../utils/dates';
import ReasonModal from '../components/ReasonModal';
import OfflineNotice from '../components/OfflineNotice';
import { colors, statusStyles } from '../theme/colors';
import FeatureShortcuts from '../components/FeatureShortcuts';

function getSummary(tasks) {
  const count = (status) => tasks.filter((task) => task.status === status).length;
  const items = [
    ['DONE', `✓ ${count('DONE')} feita(s)`],
    ['NOT_DONE', `✕ ${count('NOT_DONE')} não feita(s)`],
    ['NO_RESPONSE', `— ${count('NO_RESPONSE')} sem registro`],
    ['PENDING', `◷ ${count('PENDING')} pendente(s)`],
  ];

  return items.filter(([status]) => count(status) > 0);
}

function TaskCard({ task, onDone, onNotDone, onUndo }) {
  const style = statusStyles[task.status];
  const canRegister = task.status === 'PENDING' || task.status === 'NO_RESPONSE';
  const isHabit = task.type === 'HABIT';

  return (
    <View style={[styles.card, isHabit && styles.habitCard]}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskInfo}>
        {task.scheduledTime} · {task.dosageOrRule}
      </Text>

      <View style={[styles.statusPill, { backgroundColor: style.bg }]}>
        <Text style={[styles.statusText, { color: style.fg }]}>{style.label}</Text>
      </View>

      {task.reason && (
        <Text style={styles.taskInfo}>Motivo: {REASON_LABELS[task.reason]}</Text>
      )}

      {isHabit && (
        <>
          <View style={styles.doctorSeal}>
            <Text style={styles.doctorText}>
              ✚ Recomendado pelo médico: Dra. Helena Costa
            </Text>
          </View>
          <View style={styles.learnMore}>
            <Text style={styles.learnTitle}>Saiba mais (educativo)</Text>
            <Text style={styles.learnText}>{task.educationalNote}</Text>
          </View>
        </>
      )}

      {canRegister && (
        <View style={styles.actions}>
          <Pressable
            onPress={() => onDone(task.id)}
            accessibilityRole="button"
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.primaryText}>✓ Realizei</Text>
          </Pressable>
          <Pressable
            onPress={() => onNotDone(task.id)}
            accessibilityRole="button"
            style={[styles.button, styles.outlineButton]}
          >
            <Text style={styles.outlineText}>✕ Não realizei</Text>
          </Pressable>
        </View>
      )}

      {!canRegister && (
        <Pressable
          onPress={() => onUndo(task.id)}
          accessibilityRole="button"
          style={styles.undoButton}
        >
          <Text style={styles.undoText}>Desfazer registro</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function TodayScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState(null);
  const [reasonTask, setReasonTask] = useState(null);

  const summary = getSummary(tasks);
  const nextTask = tasks.find((task) => task.status === 'PENDING');

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setOffline(false);
      })
      .catch(() => {
        // Sem API: mostra a demonstração local para o app continuar utilizável.
        setTasks(mockTasks);
        setOffline(true);
      })
      .finally(() => setLoading(false));
  }, []);

  function replaceTask(updated) {
    setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
  }

  async function register(id, status, reason = null) {
    if (offline) {
      const task = tasks.find((t) => t.id === id);
      replaceTask({ ...task, status, reason });
      return;
    }
    try {
      replaceTask(await saveRecord(id, status, reason));
      setMessage(status === 'DONE' ? 'Registro salvo: feito.' : 'Registro salvo: não feito.');
    } catch (err) {
      setMessage(`Não foi possível salvar: ${err.message}`);
    }
  }

  function handleDone(id) {
    register(id, 'DONE');
  }

  function handleNotDone(id) {
    setReasonTask(tasks.find((task) => task.id === id));
  }

  function handleConfirmReason(id, reason) {
    setReasonTask(null);
    register(id, 'NOT_DONE', reason);
  }

  async function handleUndo(id) {
    if (offline) {
      const original = mockTasks.find((t) => t.id === id);
      replaceTask({ ...original, status: 'PENDING', reason: null });
      return;
    }
    try {
      replaceTask(await undoRecord(id));
      setMessage('Registro desfeito.');
    } catch (err) {
      setMessage(`Não foi possível desfazer: ${err.message}`);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.date}>{longDate()}</Text>
      <Text style={styles.greeting}>Olá, Ana</Text>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>O que preciso fazer hoje?</Text>
        <Text style={styles.nextTask}>
          {nextTask
            ? `Próxima: ${nextTask.title} às ${nextTask.scheduledTime}`
            : 'Nenhuma tarefa pendente para mais tarde.'}
        </Text>
        <Text style={styles.treatment}>
          Tratamento: Acompanhamento contínuo (fictício)
        </Text>
        <View style={styles.summary}>
          {summary.map(([status, label]) => (
            <View
              key={status}
              style={[
                styles.statusPill,
                { backgroundColor: statusStyles[status].bg },
              ]}
            >
              <Text
                style={[styles.statusText, { color: statusStyles[status].fg }]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {offline && <OfflineNotice />}
      {message && <Text style={styles.message}>{message}</Text>}

      <FeatureShortcuts />

      {loading && <ActivityIndicator color={colors.text} />}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDone={handleDone}
          onNotDone={handleNotDone}
          onUndo={handleUndo}
        />
      ))}

      <ReasonModal
        visible={!!reasonTask}
        task={reasonTask}
        onClose={() => setReasonTask(null)}
        onConfirm={handleConfirmReason}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 12, padding: 18, paddingTop: 32 },
  date: { fontSize: 12, color: colors.muted },
  greeting: { fontSize: 24, fontWeight: '700', color: colors.text },
  hero: {
    gap: 3,
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.limeLight,
    backgroundColor: colors.mint,
  },
  heroTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  nextTask: { fontSize: 13, fontWeight: '600', color: colors.text },
  treatment: { fontSize: 11.5, color: colors.muted },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  card: {
    gap: 8,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  habitCard: { borderWidth: 2, borderColor: '#66D575' },
  taskTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  taskInfo: { fontSize: 12, color: colors.muted },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { fontSize: 11.5, fontWeight: '600' },
  doctorSeal: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#CDF4D3',
  },
  doctorText: { fontSize: 11, fontWeight: '700', color: colors.text },
  learnMore: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#B7EBC0',
  },
  learnTitle: { fontSize: 11.5, fontWeight: '700', color: colors.text },
  learnText: { fontSize: 11.5, lineHeight: 17, color: colors.muted },
  actions: { flexDirection: 'row', gap: 8 },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  primaryButton: { backgroundColor: colors.lime },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  undoButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  undoText: { fontSize: 12.5, fontWeight: '600', color: colors.text, textDecorationLine: 'underline' },
  message: { fontSize: 12, fontWeight: '600', color: colors.text },
  primaryText: { fontSize: 13, fontWeight: '700', color: colors.text },
  outlineText: { fontSize: 13, fontWeight: '600', color: colors.text },
});