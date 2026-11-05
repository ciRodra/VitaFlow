import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import LoginScreen from './src/screens/LoginScreen';
import TodayScreen from './src/screens/TodayScreen';


const TABS = ['Hoje', 'Histórico', 'Progresso'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Hoje');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />

      {activeTab === 'Hoje' ? (
        <TodayScreen />
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>{activeTab}</Text>
        </View>
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
  content: { flex: 1, padding: 18, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
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