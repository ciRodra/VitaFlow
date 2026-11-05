import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockTasks } from '../mocks/tasks';
import { colors, statusStyles } from '../theme/colors';

const REASONS = {
  FORGOT: 'Esqueci',
  NO_MEDICATION: 'Não consegui obter o medicamento',
  DID_NOT_UNDERSTAND: 'Não entendi a orientação',
  CHOSE_NOT_TO: 'Preferi não realizar',
  OTHER: 'Outro motivo',
};

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

function TaskCard({ task, onDone, onNotDone }) {
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
        <Text style={styles.taskInfo}>Motivo: {REASONS[task.reason]}</Text>
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
    </View>
  );
}

export default function TodayScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  const summary = getSummary(tasks);
  const nextTask = tasks.find((task) => task.status === 'PENDING');

  function updateTask(id, changes) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, ...changes } : task
      )
    );
  }

  function handleDone(id) {
    updateTask(id, { status: 'DONE', reason: null });
  }

  // Temporário: será substituído pelo modal de motivo do Lucas.
  function handleNotDone(id) {
    updateTask(id, { status: 'NOT_DONE', reason: 'FORGOT' });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.date}>Quarta-feira, 4 de novembro</Text>
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

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDone={handleDone}
          onNotDone={handleNotDone}
        />
      ))}
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
  primaryText: { fontSize: 13, fontWeight: '700', color: colors.text },
  outlineText: { fontSize: 13, fontWeight: '600', color: colors.text },
});