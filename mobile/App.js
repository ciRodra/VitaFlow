import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import LoginScreen from './src/screens/LoginScreen';
import TodayScreen from './src/screens/TodayScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { login } from './src/services/api';

const TABS = ['Hoje', 'Histórico', 'Progresso'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Hoje');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogin() {
    try {
      await login();
    } catch {
      // Sem API, o app segue com os dados de demonstração.
    }
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setActiveTab('Hoje');
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />

      {/* Deixa claro quem está conectado e que é uma demonstração; permite sair. */}
      <View style={styles.accountBar}>
        <View style={styles.avatar} accessible={false}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>Ana</Text>
          <Text style={styles.accountMode}>Conta de demonstração · dados fictícios</Text>
        </View>
        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta de demonstração"
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      {activeTab === 'Hoje' && <TodayScreen />}
      {activeTab === 'Histórico' && <HistoryScreen />}
      {activeTab === 'Progresso' && (
        <ProgressScreen onOpenHistory={() => setActiveTab('Histórico')} />
      )}

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 14 : 48, // espaço da barra de status no celular
    paddingBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.lime,
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: colors.text },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 14, fontWeight: '700', color: colors.text },
  accountMode: { fontSize: 11.5, color: colors.muted },
  logoutButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 999,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  logoutText: { fontSize: 13, fontWeight: '600', color: colors.text },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 72,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 999,
  },
  activeTab: { backgroundColor: colors.lime },
  tabText: { color: colors.muted, fontSize: 13, fontWeight: '500' },
  activeTabText: { color: colors.text, fontWeight: '700' },
});