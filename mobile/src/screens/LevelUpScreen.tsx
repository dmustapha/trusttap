import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallet } from '../context/WalletContext';
import { useTrustProfile } from '../hooks/useTrustProfile';
import { getAvailableActions, computeProjectedScore, ACTION_GROUPS } from '../lib/levelup-actions';
import type { MainTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import ScoreDial from '../components/trust/ScoreDial';
import Header from '../components/layout/Header';

const VALID_INTERNAL_TABS: Record<string, keyof MainTabParamList> = {
  Profile: 'Profile',
  Scan: 'Scan',
  Search: 'Search',
  LevelUp: 'LevelUp',
};

function togglesKey(wallet: string | null) {
  return `trusttap_levelup_toggles_${wallet ?? 'default'}`;
}

export default function LevelUpScreen() {
  const { publicKey } = useWallet();
  const { profile, loading } = useTrustProfile(publicKey);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [activeToggles, setActiveToggles] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(togglesKey(publicKey))
      .then(raw => { if (raw) setActiveToggles(new Set(JSON.parse(raw))); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [publicKey]);

  const availableActions = useMemo(
    () => profile ? getAvailableActions(profile.analysis) : [],
    [profile],
  );

  const projected = useMemo(
    () => profile ? computeProjectedScore(profile.analysis, activeToggles) : null,
    [profile, activeToggles],
  );

  const toggleAction = (id: string) => {
    setActiveToggles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem(togglesKey(publicKey), JSON.stringify([...next])).catch(() => {});
      return next;
    });
  };

  if (!ready || loading || !profile || !projected) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.ttPrimary} />
          <Text style={styles.loadingText}>Loading actions...</Text>
          <Text style={styles.loadingSubtext}>Analyzing your wallet for improvement paths</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Level Up</Text>

        {/* Compact Score Dial showing projected score */}
        <View style={styles.dialRow}>
          <View style={styles.dialContainer}>
            <ScoreDial score={profile.score} label={profile.label} color={profile.color} size={100} />
            <Text style={styles.dialLabel}>Current</Text>
          </View>
          {activeToggles.size > 0 && (
            <>
              <Text style={styles.arrow}>{'\u2192'}</Text>
              <View style={styles.dialContainer}>
                <ScoreDial score={projected.score} label={projected.label} color={projected.color} size={100} />
                <Text style={styles.dialLabel}>Projected</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Groups */}
        {ACTION_GROUPS.map(group => {
          const groupActions = availableActions.filter(a => a.group === group.key);
          if (groupActions.length === 0) return null;

          return (
            <View key={group.key} style={styles.groupContainer}>
              <Text style={[styles.groupLabel, { color: group.color }]}>{group.label}</Text>
              {groupActions.map(action => (
                <View key={action.id} style={styles.actionRow}>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <View style={styles.actionControls}>
                    <Switch
                      value={activeToggles.has(action.id)}
                      onValueChange={() => toggleAction(action.id)}
                      trackColor={{ false: colors.bgElevated, true: `${colors.ttPrimary}80` }}
                      thumbColor={activeToggles.has(action.id) ? colors.ttPrimary : colors.textMuted}
                    />
                    {action.actionType === 'external' && (
                      <TouchableOpacity
                        style={styles.ctaButton}
                        activeOpacity={0.7}
                        onPress={async () => {
                          try {
                            await Linking.openURL(action.href);
                          } catch {
                            // URL not supported on device
                          }
                        }}
                      >
                        <Text style={styles.ctaText}>{action.ctaLabel}</Text>
                      </TouchableOpacity>
                    )}
                    {action.actionType === 'internal' && (
                      <TouchableOpacity
                        style={styles.ctaButton}
                        activeOpacity={0.7}
                        onPress={() => {
                          const tab = VALID_INTERNAL_TABS[action.href];
                          if (tab) navigation.navigate(tab);
                        }}
                      >
                        <Text style={styles.ctaText}>{action.ctaLabel}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    marginTop: 12,
  },
  loadingSubtext: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  dialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  dialContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dialLabel: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  arrow: {
    color: colors.ttPrimary,
    fontSize: 24,
    fontFamily: fonts.ui,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupLabel: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  actionInfo: {
    flex: 1,
    marginRight: 12,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  actionSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
    marginTop: 2,
  },
  actionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButton: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ctaText: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
});
