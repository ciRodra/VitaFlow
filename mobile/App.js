import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />

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