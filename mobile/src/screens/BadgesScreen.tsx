import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { useTrustProfile } from '../hooks/useTrustProfile';
import { BADGE_DEFINITIONS, SCORE_LABELS } from '../lib/constants';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import Header from '../components/layout/Header';

const BREAKDOWN_LABELS: Record<string, { label: string; maxPts: number }> = {
  device: { label: 'Device (SGT)', maxPts: 25 },
  financial: { label: 'Financial Depth', maxPts: 10 },
  walletAge: { label: 'Wallet Age', maxPts: 10 },
  activity: { label: 'Activity Volume', maxPts: 10 },
  diversity: { label: 'Protocol Diversity', maxPts: 10 },
  defi: { label: 'DeFi Depth', maxPts: 13 },
  identity: { label: 'Identity & Social', maxPts: 10 },
  physical: { label: 'Physical Meetings', maxPts: 12 },
};

export default function BadgesScreen() {
  const { publicKey } = useWallet();
  const { profile } = useTrustProfile(publicKey);

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Badges & Scoring</Text>

        {/* Trust Tiers */}
        <Text style={styles.sectionTitle}>Trust Tiers</Text>
        {SCORE_LABELS.map((tier, idx) => {
          const min = idx === 0 ? 0 : SCORE_LABELS[idx - 1].max + 1;
          return (
            <View key={tier.label} style={styles.tierRow}>
              <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
              <Text style={styles.tierLabel}>{tier.label}</Text>
              <Text style={styles.tierRange}>{min}{'\u2013'}{tier.max}</Text>
            </View>
          );
        })}

        {/* Score Dimensions */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Score Dimensions</Text>
        {Object.entries(BREAKDOWN_LABELS).map(([key, { label, maxPts }]) => (
          <View key={key} style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>{label}</Text>
            <Text style={styles.dimensionMax}>{maxPts} pts</Text>
          </View>
        ))}

        {/* Achievement Badges */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Achievement Badges</Text>
        {BADGE_DEFINITIONS.map(badge => {
          const earned = profile?.badges?.find(b => b.id === badge.id);
          return (
            <View key={badge.id} style={[styles.badgeCard, earned?.earned && styles.badgeCardEarned]}>
              <View style={styles.badgeHeader}>
                <Text style={styles.badgeName}>{badge.name}</Text>
                {earned?.earned ? (
                  <Text style={styles.earnedBadge}>EARNED</Text>
                ) : earned?.progress ? (
                  <Text style={styles.progressText}>{earned.progress}</Text>
                ) : null}
              </View>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
              <Text style={styles.badgeCriteria}>{badge.criteria}</Text>
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
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 13,
    color: colors.ttPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  tierDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tierLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  tierRange: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  dimensionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dimensionLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.ui,
    fontSize: 14,
  },
  dimensionMax: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  badgeCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.textMuted,
  },
  badgeCardEarned: {
    borderLeftColor: colors.ttPrimary,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeName: {
    color: colors.textPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 15,
  },
  earnedBadge: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressText: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 11,
  },
  badgeDescription: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    marginBottom: 4,
  },
  badgeCriteria: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
});
