import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockProgress, mockProgressDay } from '../mocks/progress';
import { colors, statusStyles } from '../theme/colors';
import VitaIcon from '../components/VitaIcon';
import ComingSoonModal from '../components/ComingSoonModal';

const CHART_ITEMS = [
  { key: 'done', color: '#1E7A3B', label: '✓ Feito' },
  { key: 'notDone', color: '#E8846E', label: '✕ Não feito' },
  { key: 'noResponse', color: '#C9D2CE', label: '— Sem registro' },
  { key: 'pending', color: colors.lilacLight, label: '◷ Pendente' },
];

const PERIODS = {
  Dia: {
    data: mockProgressDay,
    subtitle: 'Hoje',
    chartTitle: 'Registros de hoje',
  },
  Semana: {
    data: mockProgress,
    subtitle: 'Últimos 7 dias',
    chartTitle: 'Registros por dia (4 tarefas/dia)',
  },
};

// "Mês" aparece como opção, mas ainda abre o aviso "Em breve".
const PERIOD_BUTTONS = ['Dia', 'Semana', 'Mês'];

function percent(rate) {
  return Math.round(rate * 100);
}

function RateBar({ title, rate, detail, color }) {
  const value = percent(rate);

  return (
    <View style={styles.rate}>
      <View style={styles.rateHeader}>
        <Text style={styles.rateTitle}>{title}</Text>
        <Text style={styles.rateValue}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.small}>{detail}</Text>
    </View>
  );
}

function DayBar({ day }) {
  return (
    <View style={styles.day}>
      <View style={styles.segments}>
        {CHART_ITEMS.flatMap((item) =>
          Array.from({ length: day[item.key] }, (_, index) => (
            <View
              key={`${item.key}-${index}`}
              style={[styles.segment, { backgroundColor: item.color }]}
            />
          ))
        )}
      </View>
      <Text style={styles.dayLabel}>{day.label}</Text>
    </View>
  );
}

export default function ProgressScreen({ onOpenHistory }) {
  const [period, setPeriod] = useState('Semana');
  const [feature, setFeature] = useState(null);
  const { data: progress, subtitle, chartTitle } = PERIODS[period];
  const recorded = progress.done + progress.notDone;
  const dueTasks = recorded + progress.noResponse;
  const kpis = [
    { value: progress.done, status: 'DONE' },
    { value: progress.notDone, status: 'NOT_DONE' },
    { value: progress.noResponse, status: 'NO_RESPONSE' },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Progresso</Text>
        <Pressable
          onPress={onOpenHistory}
          accessibilityRole="button"
          style={styles.historyButton}
        >
          <Text style={styles.historyText}>Ver histórico ›</Text>
        </Pressable>
      </View>

      <View style={styles.periods}>
        {PERIOD_BUTTONS.map((name) => {
          const isActive = name === period;
          return (
            <Pressable
              key={name}
              onPress={() => (PERIODS[name] ? setPeriod(name) : setFeature('mes'))}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.periodButton, isActive && styles.periodActive]}
            >
              <Text style={[styles.periodText, isActive && styles.periodTextActive]}>
                {name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.small}>
        {subtitle} · {progress.totalTasks} tarefas previstas
      </Text>

      <View style={styles.kpis}>
        {kpis.map((kpi) => {
          const style = statusStyles[kpi.status];
          return (
            <View key={kpi.status} style={[styles.kpi, { backgroundColor: style.bg }]}>
              <Text style={[styles.kpiValue, { color: style.fg }]}>{kpi.value}</Text>
              <Text style={[styles.kpiLabel, { color: style.fg }]}>{style.label}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.small}>
        {progress.pending} tarefas pendentes hoje, fora das duas taxas.
      </Text>

      <View style={styles.card}>
        <RateBar
          title="Quanto você registrou"
          rate={progress.registrationRate}
          detail={`${recorded} de ${dueTasks} tarefas tiveram registro`}
          color={colors.lilac}
        />
        <RateBar
          title="Entre os registros, quanto foi feito"
          rate={progress.completionRate}
          detail={`${progress.done} de ${recorded} registros marcados como feito`}
          color="#5FAF35"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>{chartTitle}</Text>
        <View style={styles.chart}>
          {progress.dailyBreakdown.map((day) => (
            <DayBar key={day.date} day={day} />
          ))}
        </View>
        <View style={styles.legend}>
          {CHART_ITEMS.map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => setFeature('relatorio')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.card, styles.reportCard, pressed && styles.pressed]}
      >
        <VitaIcon name="relatorio" size={40} />
        <View style={styles.reportBody}>
          <Text style={styles.chartTitle}>Relatório de medicações</Text>
          <Text style={styles.small}>Todas as datas e horários dos seus medicamentos</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Text style={styles.notice}>
        Baseado apenas nos seus registros.{'\n'}
        Não representa avaliação clínica nem adesão comprovada.
      </Text>

      <ComingSoonModal feature={feature} onClose={() => setFeature(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 12, padding: 18, paddingTop: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  historyButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  historyText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  periods: { flexDirection: 'row', gap: 8 },
  periodButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 999,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  periodActive: { borderColor: colors.text, backgroundColor: colors.text },
  periodText: { fontSize: 13, fontWeight: '600', color: colors.text },
  periodTextActive: { color: colors.surface },
  small: { fontSize: 12, color: colors.muted },
  kpis: { flexDirection: 'row', gap: 8 },
  kpi: { flex: 1, padding: 12, borderRadius: 16 },
  kpiValue: { fontSize: 25, fontWeight: '700' },
  kpiLabel: { fontSize: 11, fontWeight: '700' },
  card: {
    gap: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  rate: { gap: 5 },
  rateHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  rateTitle: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text },
  rateValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  track: {
    height: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: statusStyles.NO_RESPONSE.bg,
  },
  fill: { height: 10, borderRadius: 5 },
  chartTitle: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  chart: { flexDirection: 'row', justifyContent: 'space-around' },
  day: { alignItems: 'center', gap: 5 },
  segments: { width: 24, flexDirection: 'column-reverse', gap: 2 },
  segment: { height: 16, borderRadius: 4 },
  dayLabel: { fontSize: 10.5, fontWeight: '600', color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 11, color: colors.text },
  reportCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportBody: { flex: 1, gap: 2 },
  chevron: { fontSize: 22, color: colors.muted },
  pressed: { opacity: 0.7 },
  notice: { fontSize: 11.5, lineHeight: 17, textAlign: 'center', color: colors.muted },
});