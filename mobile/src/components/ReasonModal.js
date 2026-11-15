import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { REASONS } from '../constants/reasons';

// Props: visible, task, onClose, onConfirm(taskId, reason)
export default function ReasonModal({ visible, task, onClose, onConfirm }) {
  const [reason, setReason] = useState(null);

  // Sempre começa sem motivo escolhido.
  useEffect(() => {
    if (visible) setReason(null);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Não realizei. O que aconteceu?</Text>
          {task && (
            <Text style={styles.task}>
              {task.title} · {task.scheduledTime}
            </Text>
          )}

          <View style={styles.options} accessibilityRole="radiogroup">
            {REASONS.map((item) => {
              const selected = item.code === reason;
              return (
                <Pressable
                  key={item.code}
                  onPress={() => setReason(item.code)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.notice}>
            Este registro é uma declaração sua. Não é uma avaliação médica.
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onClose} accessibilityRole="button" style={[styles.button, styles.cancel]}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => reason && onConfirm(task.id, reason)}
              disabled={!reason}
              accessibilityRole="button"
              accessibilityState={{ disabled: !reason }}
              style={[styles.button, styles.save, !reason && styles.saveDisabled]}
            >
              <Text style={styles.saveText}>Salvar registro</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(6, 75, 56, 0.35)',
  },
  sheet: {
    gap: 12,
    padding: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  task: { fontSize: 12.5, color: colors.muted },
  options: { gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 14,
    borderColor: colors.line,
  },
  optionSelected: { borderColor: colors.text, backgroundColor: colors.mint },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.muted,
  },
  radioSelected: { borderColor: colors.text },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.text },
  optionText: { flex: 1, fontSize: 14, color: colors.text },
  notice: { fontSize: 11.5, lineHeight: 16, color: colors.muted },
  actions: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  cancel: { borderWidth: 1.5, borderColor: colors.text, backgroundColor: colors.surface },
  cancelText: { fontSize: 14, fontWeight: '600', color: colors.text },
  save: { backgroundColor: colors.lime },
  saveDisabled: { opacity: 0.45 },
  saveText: { fontSize: 14, fontWeight: '700', color: colors.text },
});
