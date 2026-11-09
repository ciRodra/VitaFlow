import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

const DEMO_EMAIL = 'ana.demo@vitaflow.app';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState('demonstracao');

  return (
    <View style={styles.screen}>
      <View style={styles.circleGreen} />
      <View style={styles.circleLilac} />

      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoCross}>✚</Text>
        </View>
        <Text style={styles.name}>VitaFlow</Text>
        <Text style={styles.slogan}>Seu cuidado em movimento.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="E-mail"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Senha"
          style={styles.input}
        />

        <Pressable
          onPress={onLogin}
          accessibilityRole="button"
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>Entrar</Text>
        </Pressable>

        <Pressable
          onPress={onLogin}
          accessibilityRole="button"
          style={styles.outlineButton}
        >
          <Text style={styles.outlineText}>Usar conta de demonstração</Text>
        </Pressable>
      </View>

      <Text style={styles.notice}>
        O VitaFlow organiza orientações já recebidas.{'\n'}
        Não substitui o profissional de saúde.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 18,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: colors.mint,
  },
  circleGreen: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.6,
    backgroundColor: colors.lime,
  },
  circleLilac: {
    position: 'absolute',
    top: 110,
    left: -46,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.5,
    backgroundColor: colors.lilac,
  },
  brand: { gap: 3 },
  logo: {
    width: 76,
    height: 76,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 22,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  logoCross: { fontSize: 34, color: colors.text },
  name: { fontSize: 34, fontWeight: '700', color: colors.text },
  slogan: { fontSize: 15, color: colors.muted },
  card: {
    gap: 8,
    padding: 18,
    borderWidth: 1,
    borderRadius: 22,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  input: {
    height: 46,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: colors.line,
    color: colors.text,
    backgroundColor: colors.background,
  },
  primaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.lime,
  },
  primaryText: { fontSize: 15, fontWeight: '700', color: colors.text },
  outlineButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  outlineText: { fontSize: 14, fontWeight: '600', color: colors.text },
  notice: { fontSize: 12, lineHeight: 18, textAlign: 'center', color: colors.muted },
});