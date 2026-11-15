import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, statusStyles } from '../theme/colors';
import useProgress from '../hooks/useProgress';
import { rangeLabel } from '../utils/dates';
import VitaIcon from '../components/VitaIcon';
import OfflineNotice from '../components/OfflineNotice';

// Aba Progresso: só o essencial. Percentuais e gráfico ficam na tela Estatísticas.
const PERIODS = [
  { key: 'Hoje', days: 1, title: 'Resumo de hoje' },
  { key: 'Esta semana', days: 7, title: 'Resumo da semana' },
];

const CARDS = [
  { key: 'done', status: 'DONE', label: 'Feitas', hint: 'Você marcou como realizadas' },
  { key: 'notDone', status: 'NOT_DONE', label: 'Não feitas', hint: 'Você informou o motivo' },
  { key: 'noResponse', status: 'NO_RESPONSE', label: 'Sem registro', hint: 'Horário passou sem informação' },
  { key: 'pending', status: 'PENDING', label: 'Pendentes', hint: 'Ainda dentro do horário' },
];

function summarySentence(p) {
  const recorded = p.done + p.notDone;
  const due = recorded + p.noResponse;
  if (due === 0) return 'Ainda não há atividades com o horário vencido neste período.';
  return `Você registrou ${recorded} das ${due} atividades que já passaram do horário, e ${p.done} ${
    p.done === 1 ? 'delas foi feita' : 'delas foram feitas'
  }.`;
}

function LinkCard({ icon, title, text, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${text}`}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}
    >
      <VitaIcon name={icon} size={40} />
      <View style={styles.linkBody}>
        <Text style={styles.linkTitle}>{title}</Text>
        <Text style={styles.small}>{text}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function ProgressScreen({ onOpenHistory, onOpenStats }) {
  const [periodKey, setPeriodKey] = useState('Esta semana');
  const period = PERIODS.find((p) => p.key === periodKey);
  const { data: progress, loading, offline } = useProgress(period.days);

  const days = progress ? progress.dailyBreakdown || [] : [];
  const range = days.length ? rangeLabel(days[0].date, days[days.length - 1].date) : '';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.title} accessibilityRole="header">Seu progresso</Text>
        <Text style={styles.subtitle}>Um resumo simples dos seus registros.</Text>
      </View>

      <View style={styles.segment}>
        {PERIODS.map((p) => {
          const isActive = p.key === periodKey;
          return (
            <Pressable
              key={p.key}
              onPress={() => setPeriodKey(p.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.segmentItem, isActive && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{p.key}</Text>
            </Pressable>
          );
        })}
      </View>

      {offline && <OfflineNotice />}

      {!progress || loading ? (
        <ActivityIndicator color={colors.text} style={styles.loader} />
      ) : (
        <>
          <View>
            <Text style={styles.sectionTitle}>{period.title}</Text>
            <Text style={styles.small}>
              {range} · {progress.totalTasks} {progress.totalTasks === 1 ? 'atividade prevista' : 'atividades previstas'}
            </Text>
          </View>

          <View style={styles.grid}>
            {CARDS.map((card) => {
              const style = statusStyles[card.status];
              const value = progress[card.key];
              return (
                <View
                  key={card.key}
                  style={[styles.kpi, { backgroundColor: style.bg }]}
                  accessible
                  accessibilityLabel={`${value} ${card.label}. ${card.hint}`}
                >
                  <Text style={[styles.kpiValue, { color: style.fg }]}>{value}</Text>
                  <Text style={[styles.kpiLabel, { color: style.fg }]}>
                    {style.label.slice(0, 1)} {card.label}
                  </Text>
                  <Text style={[styles.kpiHint, { color: style.fg }]}>{card.hint}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.sentence}>
            <Text style={styles.sentenceText}>{summarySentence(progress)}</Text>
          </View>
        </>
      )}

      <LinkCard
        icon="mes"
        title="Ver estatísticas"
        text="Percentuais e gráfico dia a dia"
        onPress={onOpenStats}
      />
      <LinkCard
        icon="tarefas"
        title="Ver histórico"
        text="O que aconteceu com cada atividade"
        onPress={onOpenHistory}
      />

      <Text style={styles.notice}>
        Baseado apenas nos seus registros.{'\n'}
        Não representa avaliação clínica nem adesão comprovada.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 14, padding: 18, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  segmentItem: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  segmentActive: { backgroundColor: colors.text },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.text },
  segmentTextActive: { color: colors.surface },
  loader: { marginVertical: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  small: { fontSize: 12, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: { flexGrow: 1, flexBasis: '45%', gap: 2, padding: 14, borderRadius: 16 },
  kpiValue: { fontSize: 28, fontWeight: '700' },
  kpiLabel: { fontSize: 12, fontWeight: '700' },
  kpiHint: { fontSize: 11, opacity: 0.85 },
  sentence: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  sentenceText: { fontSize: 13.5, lineHeight: 20, color: colors.text },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  linkBody: { flex: 1, gap: 2 },
  linkTitle: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  chevron: { fontSize: 24, color: colors.muted },
  pressed: { opacity: 0.7 },
  notice: { fontSize: 11.5, lineHeight: 17, textAlign: 'center', color: colors.muted },
});
