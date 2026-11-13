import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import VitaIcon from './VitaIcon';
import ComingSoonModal from './ComingSoonModal';

const SHORTCUTS = [
  { key: 'tarefas', title: 'Tarefas ativas', text: 'Início e fim de cada tratamento' },
  { key: 'calendario', title: 'Calendário', text: 'Retornos e consultas' },
];

export default function FeatureShortcuts() {
  const [feature, setFeature] = useState(null);

  return (
    <View style={styles.row}>
      {SHORTCUTS.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => setFeature(item.key)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <VitaIcon name={item.key} size={36} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </Pressable>
      ))}

      <ComingSoonModal feature={feature} onClose={() => setFeature(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginVertical: 8 },
  card: {
    flex: 1,
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.7 },
  title: { fontSize: 13.5, fontWeight: '700', color: colors.text },
  text: { fontSize: 11.5, color: colors.muted },
});
