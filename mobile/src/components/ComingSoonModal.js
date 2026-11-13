import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import VitaIcon from './VitaIcon';

export const FEATURES = {
  mes: {
    title: 'Visão de mês',
    text: 'Veja o gráfico do seu progresso nos últimos 30 dias.',
  },
  tarefas: {
    title: 'Tarefas ativas',
    text: 'Acompanhe todas as tarefas do seu tratamento, com data de início e de fim.',
  },
  calendario: {
    title: 'Calendário',
    text: 'Seus retornos e consultas futuras reunidos em um só lugar.',
  },
  relatorio: {
    title: 'Relatório de medicações',
    text: 'Um relatório com todas as datas e horários dos seus medicamentos.',
  },
};

export default function ComingSoonModal({ feature, onClose }) {
  const info = feature ? FEATURES[feature] : null;

  return (
    <Modal visible={!!info} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {info && (
            <>
              <VitaIcon name={feature} size={56} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Em breve</Text>
              </View>
              <Text style={styles.title}>{info.title}</Text>
              <Text style={styles.text}>{info.text}</Text>
              <Text style={styles.note}>
                Este recurso está planejado para as próximas versões do VitaFlow.
              </Text>
              <Pressable onPress={onClose} accessibilityRole="button" style={styles.button}>
                <Text style={styles.buttonText}>Entendi</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(6, 75, 56, 0.35)',
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 10,
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.lilacLight,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.text },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  text: { fontSize: 14, lineHeight: 20, color: colors.text, textAlign: 'center' },
  note: { fontSize: 12, lineHeight: 17, color: colors.muted, textAlign: 'center' },
  button: {
    alignSelf: 'stretch',
    minHeight: 48,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.lime,
  },
  buttonText: { fontSize: 15, fontWeight: '700', color: colors.text },
});
