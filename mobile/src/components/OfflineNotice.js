import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

// Aparece quando a API não responde: a tela continua funcionando com os dados de demonstração.
export default function OfflineNotice() {
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.text}>
        API indisponível. Mostrando dados de demonstração; os registros não serão salvos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.lilacLight,
  },
  text: { fontSize: 11.5, lineHeight: 16, color: '#2D3A7A' },
});
