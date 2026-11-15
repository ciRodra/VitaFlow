import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import useProgress from '../hooks/useProgress';
import { rangeLabel, shortDay, todayKey } from '../utils/dates';
import ComingSoonModal from '../components/ComingSoonModal';
import OfflineNotice from '../components/OfflineNotice';

// Tela de detalhes, aberta pelo botão "Ver estatísticas" do Progresso.
const PERIODS = [
  { key: 'Dia', days: 1 },
  { key: 'Semana', days: 7 },
  { key: 'Mês', days: null }, // ainda não disponível: abre o aviso "Em breve"
];

// Tons mais escuros que os do fundo dos cartões, para contrastar na barra.
const SEGMENTS = [
  { key: 'done', color: '#2E7D4F', one: 'feita', many: 'feitas', legend: '✓ Feita' },
  { key: 'notDone', color: '#C0583F', one: 'não feita', many: 'não feitas', legend: '✕ Não feita' },
  { key: 'noResponse', color: '#8A9691', one: 'sem registro', many: 'sem registro', legend: '— Sem registro' },
  { key: 'pending', color: '#7480BD', one: 'pendente', many: 'pendentes', legend: '◷ Pendente' },
];

function describeDay(day) {
  const parts = SEGMENTS.filter((s) => day[s.key] > 0).map(
    (s) => `${day[s.key]} ${day[s.key] === 1 ? s.one : s.many}`
  );
  return parts.length ? parts.join(' · ') : 'Nenhuma atividade prevista';
}

function Section({ title, open, onToggle, children }) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}. ${open ? 'Toque para fechar' : 'Toque para abrir'}`}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.toggle}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open && children}
    </View>
  );
}

function RateBar({ title, numerator, denominator, detail, color }) {
  const hasData = denominator > 0;
  const value = hasData ? Math.round((numerator / denominator) * 100) : 0;
  return (
    <View
      style={styles.rate}
      accessible
      accessibilityLabel={`${title}: ${hasData ? `${value}%` : 'sem dados suficientes'}. ${detail}`}
    >
      <View style={styles.rateHeader}>
        <Text style={styles.rateTitle}>{title}</Text>
        <Text style={hasData ? styles.rateValue : styles.rateEmpty}>
          {hasData ? `${value}%` : 'Sem dados suficientes'}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.small}>{detail}</Text>
    </View>
  );
}

function DayRow({ day }) {
  const total = SEGMENTS.reduce((sum, s) => sum + (day[s.key] || 0), 0);
  const label = day.date === todayKey() ? `Hoje · ${shortDay(day.date)}` : shortDay(day.date);
  const description = describeDay(day);
  return (
    <View style={styles.day} accessible accessibilityLabel={`${label}: ${description}`}>
      <Text style={styles.dayLabel}>{label}</Text>
      <View style={styles.bar}>
        {total === 0 ? (
          <View style={styles.emptyBar} />
        ) : (
          SEGMENTS.filter((s) => day[s.key] > 0).map((s) => (
            <View key={s.key} style={[styles.segmentFill, { flex: day[s.key], backgroundColor: s.color }]} />
          ))
        )}
      </View>
      <Text style={styles.dayText}>{description}</Text>
    </View>
  );
}

export default function StatisticsScreen({ onBack }) {
  const [periodKey, setPeriodKey] = useState('Semana');
  const [feature, setFeature] = useState(null);
  const [openRates, setOpenRates] = useState(true);
  const [openDays, setOpenDays] = useState(true);

  const period = PERIODS.find((p) => p.key === periodKey);
  const { data: progress, loading, offline } = useProgress(period.days);

  const days = progress ? progress.dailyBreakdown || [] : [];
  const recorded = progress ? progress.done + progress.notDone : 0;
  const due = progress ? recorded + progress.noResponse : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao progresso"
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Voltar ao progresso</Text>
      </Pressable>

      <View>
        <Text style={styles.title} accessibilityRole="header">Estatísticas</Text>
        {progress && !loading && days.length > 0 && (
          <Text style={styles.subtitle}>
            {rangeLabel(days[0].date, days[days.length - 1].date)} · {progress.totalTasks} atividades previstas
          </Text>
        )}
      </View>

      <View style={styles.segment}>
        {PERIODS.map((p) => {
          const isActive = p.key === periodKey;
          return (
            <Pressable
              key={p.key}
              onPress={() => (p.days ? setPeriodKey(p.key) : setFeature('mes'))}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.segmentItem, isActive && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{p.key}</Text>
              {!p.days && <Text style={styles.soon}>Em breve</Text>}
            </Pressable>
          );
        })}
      </View>

      {offline && <OfflineNotice />}

      {!progress || loading ? (
        <ActivityIndicator color={colors.text} style={styles.loader} />
      ) : (
        <>
          <Section title="Percentuais" open={openRates} onToggle={() => setOpenRates(!openRates)}>
            <RateBar
              title="Atividades registradas"
              numerator={recorded}
              denominator={due}
              detail={`${recorded} de ${due} atividades que já passaram do horário.`}
              color="#7480BD"
            />
            <RateBar
              title="Atividades realizadas"
              numerator={progress.done}
              denominator={recorded}
              detail={`${progress.done} das ${recorded} registradas. Pendentes não entram na conta.`}
              color="#2E7D4F"
            />
          </Section>

          <Section title="Registros por dia" open={openDays} onToggle={() => setOpenDays(!openDays)}>
            {days.map((day) => (
              <DayRow key={day.date} day={day} />
            ))}
            <View style={styles.legend} importantForAccessibility="no-hide-descendants">
              {SEGMENTS.map((s) => (
                <View key={s.key} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: s.color }]} />
                  <Text style={styles.legendText}>{s.legend}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.small}>
              “Sem registro” não quer dizer que a atividade deixou de ser feita.
            </Text>
          </Section>
        </>
      )}

      <Pressable
        onPress={() => setFeature('relatorio')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.card, styles.reportRow, pressed && styles.pressed]}
      >
        <Text style={styles.sectionTitle}>Relatório de medicações</Text>
        <Text style={styles.toggle}>›</Text>
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
  content: { gap: 12, padding: 18, paddingTop: 4 },
  back: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 14, fontWeight: '600', color: colors.text },
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
    flexDirection: 'row',
    gap: 4,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  segmentActive: { backgroundColor: colors.text },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.text },
  segmentTextActive: { color: colors.surface },
  soon: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 9.5,
    fontWeight: '700',
    color: '#2D3A7A',
    backgroundColor: colors.lilacLight,
  },
  loader: { marginVertical: 24 },
  card: {
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  toggle: { fontSize: 18, color: colors.muted },
  rate: { gap: 5 },
  rateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  rateTitle: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text },
  rateValue: { fontSize: 20, fontWeight: '700', color: colors.text },
  rateEmpty: { fontSize: 12, fontWeight: '600', color: colors.muted },
  track: { height: 10, overflow: 'hidden', borderRadius: 5, backgroundColor: '#ECEFEE' },
  fill: { height: 10, borderRadius: 5 },
  small: { fontSize: 12, color: colors.muted },
  day: { gap: 4 },
  dayLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  bar: { flexDirection: 'row', gap: 2, height: 14, overflow: 'hidden', borderRadius: 7 },
  segmentFill: { height: 14 },
  emptyBar: { flex: 1, height: 14, backgroundColor: colors.background },
  dayText: { fontSize: 12, color: colors.text },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendColor: { width: 11, height: 11, borderRadius: 3 },
  legendText: { fontSize: 11.5, color: colors.text },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pressed: { opacity: 0.7 },
  notice: { fontSize: 11.5, lineHeight: 17, textAlign: 'center', color: colors.muted },
});
