import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

const DEMO_EMAIL = 'ana.demo@vitaflow.app';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function enterDemo() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await onLogin();
    } finally {
      setBusy(false);
    }
  }

  // Nesta versão não há autenticação real: só a conta fictícia de demonstração.
  function handleSubmit() {
    if (!email.trim()) {
      setError('Digite seu e-mail para continuar.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL) {
      setError('Nesta versão, só a conta de demonstração está disponível. Use o botão abaixo.');
      return;
    }
    enterDemo();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.circleGreen} />
      <View style={styles.circleLilac} />

      <View style={styles.brand}>
        <Image
          source={require('../../assets/vitaflow-logo.png')}
          style={styles.logo}
          accessibilityLabel="Logo do VitaFlow"
        />
        <Text style={styles.name}>VitaFlow</Text>
        <Text style={styles.slogan}>Seu cuidado em movimento.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>Versão de demonstração · dados fictícios</Text>
        </View>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError(null);
          }}
          placeholder={DEMO_EMAIL}
          placeholderTextColor={colors.muted}
          autoComplete="email"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="E-mail"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          autoComplete="password"
          secureTextEntry
          accessibilityLabel="Senha"
          style={styles.input}
        />

        {error && (
          <Text style={styles.error} accessibilityRole="alert">
            ⚠ {error}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={busy}
          accessibilityRole="button"
          accessibilityState={{ disabled: busy }}
          style={[styles.primaryButton, busy && styles.busy]}
        >
          {busy ? <ActivityIndicator color={colors.text} /> : <Text style={styles.primaryText}>Entrar</Text>}
        </Pressable>

        <Pressable
          onPress={enterDemo}
          disabled={busy}
          accessibilityRole="button"
          accessibilityState={{ disabled: busy }}
          style={[styles.outlineButton, busy && styles.busy]}
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
  logo: { width: 76, height: 76, marginBottom: 10, borderRadius: 22 },
  demoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
    borderRadius: 999,
    backgroundColor: colors.lilacLight,
  },
  demoBadgeText: { fontSize: 12, fontWeight: '700', color: '#2D3A7A' },
  error: { fontSize: 13, lineHeight: 18, fontWeight: '600', color: '#9A2B16' },
  busy: { opacity: 0.6 },
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
    borderColor: colors.lineStrong,
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