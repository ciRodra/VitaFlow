import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockProgress, mockProgressDay } from '../mocks/progress';
import { getProgress } from '../services/api';
import { weekdayShort } from '../utils/dates';
import OfflineNotice from '../components/OfflineNotice';
import { colors, statusStyles } from '../theme/colors';
import VitaIcon from '../components/VitaIcon';
import ComingSoonModal from '../components/ComingSoonModal';

const CHART_ITEMS = [
  { key: 'done', color: '#277849', label: '✓ Feito' },
  { key: 'notDone', color: '#BA6149', label: '✕ Não feito' },
  { key: 'noResponse', color: '#6B7873', label: '— Sem registro' },
  { key: 'pending', color: '#6975AB', label: '◷ Pendente' },
];

const PERIODS = {
  Dia: {
    days: 1,
    data: mockProgressDay,
    subtitle: 'Hoje',
    chartTitle: 'Registros de hoje',
  },
  Semana: {
    days: 7,
    data: mockProgress,
    subtitle: 'Últimos 7 dias',
    chartTitle: 'Registros por dia',
  },
  Mês: {
    days: 30,
    data: null,
    subtitle: 'Últimos 30 dias',
    chartTitle: 'Registros agrupados por semana',
  },
};

const PERIOD_BUTTONS = ['Dia', 'Semana', 'Mês'];

// A API devolve só a data de cada dia; o rótulo do gráfico é montado aqui.
function withLabels(progress, period) {
  return {
    ...progress,
    dailyBreakdown: progress.dailyBreakdown.map((day) => ({
      ...day,
      label: day.label || (period === 'Dia' ? 'Hoje' : weekdayShort(day.date)),
    })),
  };
}

function percent(rate) {
  return Math.round(rate * 100);
}

function RateBar({ title, rate, detail, color, available = true }) {
  const value = percent(rate);

  return (
    <View style={styles.rate}>
      <View style={styles.rateHeader}>
        <Text style={styles.rateTitle}>{title}</Text>
        <Text style={styles.rateValue}>{available ? value + '%' : '—'}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: (available ? value : 0) + '%', backgroundColor: color }]} />
      </View>
      <Text style={styles.small}>{detail}</Text>
    </View>
  );
}

// No mês, agrupa dias em semanas consecutivas para preservar legibilidade no celular.
function rowsForPeriod(items, period) {
  if (period !== 'Mês') return items;
  const rows = [];
  for (let i = 0; i < items.length; i += 7) {
    const chunk = items.slice(i, i + 7);
    if (!chunk.length) continue;
    const short = (value) => value.slice(8, 10) + '/' + value.slice(5, 7);
    const row = {
      date: chunk[0].date,
      label: short(chunk[0].date) + ' – ' + short(chunk[chunk.length - 1].date),
      done: 0, notDone: 0, noResponse: 0, pending: 0,
    };
    for (const day of chunk) {
      for (const item of CHART_ITEMS) row[item.key] += Number(day[item.key] || 0);
    }
    rows.push(row);
  }
  return rows;
}

function DayBar({ day }) {
  const total = CHART_ITEMS.reduce((sum, item) => sum + Number(day[item.key] || 0), 0);
  const summary = CHART_ITEMS
    .filter((item) => day[item.key] > 0)
    .map((item) => item.label + ': ' + day[item.key])
    .join(' · ');
  return (
    <View style={styles.day} accessible accessibilityLabel={day.label + '. ' + (summary || 'Nenhuma atividade prevista')}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayLabel}>{day.label}</Text>
        <Text style={styles.dayCount}>{total} {total === 1 ? 'atividade' : 'atividades'}</Text>
      </View>
      <View style={styles.segments} accessible={false} importantForAccessibility="no-hide-descendants">
        {total === 0 ? <View style={styles.emptyBar} /> : CHART_ITEMS.map((item) => {
          const count = Number(day[item.key] || 0);
          if (count === 0) return null;
          return (
            <View
              key={item.key}
              style={[styles.segment, { flex: count, backgroundColor: item.color }]}
            />
          );
        })}
      </View>
      <Text style={styles.dayDetails}>{summary || 'Nenhuma atividade prevista'}</Text>
    </View>
  );
}

export default function ProgressScreen({ onOpenHistory }) {
  const [period, setPeriod] = useState('Semana');
  const [feature, setFeature] = useState(null);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProgress(PERIODS[period].days)
      .then((data) => {
        setApiData((current) => ({ ...current, [period]: withLabels(data, period) }));
        setOffline(false);
      })
      .catch(() => setOffline(true))
      .finally(() => setLoading(false));
  }, [period]);

  const { subtitle, chartTitle } = PERIODS[period];
  // Sem API, usa os dados de demonstração do período.
  const progress = apiData[period] || (offline ? PERIODS[period].data : null);

  if (!progress) {
    return (
      <View style={styles.loadingScreen}>
        {offline ? (
          <>
            <Text style={styles.title}>Progresso indisponível</Text>
            <Text style={styles.small}>O resumo mensal precisa de conexão com a API.</Text>
            <Pressable style={styles.historyButton} accessibilityRole="button" onPress={() => setPeriod('Semana')}>
              <Text style={styles.historyText}>Voltar à semana</Text>
            </Pressable>
          </>
        ) : <ActivityIndicator color={colors.text} />}
      </View>
    );
  }

  const recorded = progress.done + progress.notDone;
  const dueTasks = recorded + progress.noResponse;
  const kpis = [
    { value: progress.done, status: 'DONE' },
    { value: progress.notDone, status: 'NOT_DONE' },
    { value: progress.noResponse, status: 'NO_RESPONSE' },
    { value: progress.pending, status: 'PENDING' },
  ];
  const chartRows = rowsForPeriod(progress.dailyBreakdown || [], period);
  const periodLabel = period === 'Dia' ? 'do dia' : period === 'Semana' ? 'da semana' : 'dos últimos 30 dias';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headingGroup}>
          <Text style={styles.title}>Seu progresso</Text>
          <Text style={styles.intro}>Entenda seus registros de forma simples.</Text>
        </View>
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
              onPress={() => setPeriod(name)}
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

      {offline && <OfflineNotice />}
      {offline && <Text style={styles.exampleNotice}>Exibindo valores ilustrativos, não os registros atuais da conta.</Text>}
      {loading && <ActivityIndicator color={colors.text} />}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Resumo {periodLabel}</Text>
        <Text style={styles.small}>{subtitle} · {progress.totalTasks} tarefas previstas</Text>
      </View>

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
        As {progress.pending} {progress.pending === 1 ? 'atividade pendente não entra' : 'atividades pendentes não entram'} nas duas taxas.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Como estão seus registros?</Text>
        <RateBar
          title="Atividades com registro"
          rate={progress.registrationRate}
          available={dueTasks > 0}
          detail={dueTasks ? recorded + ' de ' + dueTasks + ' atividades com horário já considerado' : 'Nenhuma atividade com horário considerado'}
          color="#6975AB"
        />
        <RateBar
          title="Realizadas entre as registradas"
          rate={progress.completionRate}
          available={recorded > 0}
          detail={recorded ? progress.done + ' de ' + recorded + ' registros marcados como feitos' : 'Ainda não há registros feitos ou não feitos'}
          color="#277849"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{chartTitle}</Text>
        <Text style={styles.small}>Cada barra mostra o resultado das atividades previstas naquele período.</Text>
        <View style={styles.chart}>
          {chartRows.map((day) => (
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
        <Text style={styles.explanation}>Sem registro significa que a pessoa ainda não informou o resultado, não que deixou de realizar a atividade.</Text>
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
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  content: { gap: 14, padding: 18, paddingTop: 32, paddingBottom: 32, width: '100%', maxWidth: 940, alignSelf: 'center' },
  headingGroup: { flex: 1, gap: 4 },
  intro: { fontSize: 14, lineHeight: 21, color: colors.muted },
  sectionHeading: { gap: 3 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  exampleNotice: { fontSize: 13, lineHeight: 19, color: colors.text },
  explanation: { fontSize: 13, lineHeight: 20, color: colors.muted, paddingTop: 4 },
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
  small: { fontSize: 13, lineHeight: 19, color: colors.muted },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: { flexGrow: 1, flexBasis: 140, minWidth: 130, padding: 16, borderRadius: 16, gap: 4 },
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
  chart: { gap: 18, marginTop: 8 },
  day: { gap: 7 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  segments: { flexDirection: 'row', height: 22, borderRadius: 9, overflow: 'hidden', backgroundColor: colors.background },
  segment: { height: 22, minWidth: 2 },
  emptyBar: { width: '100%', height: 22, backgroundColor: colors.background },
  dayLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  dayCount: { fontSize: 12.5, color: colors.muted },
  dayDetails: { fontSize: 12.5, lineHeight: 19, color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendColor: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12.5, color: colors.text },
  reportCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportBody: { flex: 1, gap: 2 },
  chevron: { fontSize: 22, color: colors.muted },
  pressed: { opacity: 0.7 },
  notice: { fontSize: 12.5, lineHeight: 19, textAlign: 'center', color: colors.muted },
});