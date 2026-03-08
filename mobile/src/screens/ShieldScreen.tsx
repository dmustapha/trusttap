import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import Header from '../components/layout/Header';
import sybilData from '../data/sybil-demo.json';

export default function ShieldScreen() {
  const [threshold, setThreshold] = useState(40);
  const [requireSGT, setRequireSGT] = useState(false);

  const results = useMemo(() => {
    return sybilData.map((wallet: any) => ({
      ...wallet,
      passed: (requireSGT ? wallet.hasSGT : true) &&
              (wallet.trustScore !== null ? wallet.trustScore >= threshold : false),
    }));
  }, [threshold, requireSGT]);

  const stats = useMemo(() => ({
    total: results.length,
    passed: results.filter((r: any) => r.passed).length,
    rejected: results.filter((r: any) => !r.passed).length,
    sgtVerified: results.filter((r: any) => r.hasSGT).length,
  }), [results]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sybil Shield</Text>
        <Text style={styles.subtitle}>Filter bots from real humans using trust scores</Text>

        {/* Controls */}
        <View style={styles.controlCard}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Min Trust Score: {threshold}</Text>
            <View style={styles.thresholdButtons}>
              {[20, 40, 60, 80].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.thresholdButton,
                    threshold === val && styles.thresholdButtonActive,
                  ]}
                  onPress={() => setThreshold(val)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.thresholdButtonText,
                    threshold === val && styles.thresholdButtonTextActive,
                  ]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Require SGT</Text>
            <Switch
              value={requireSGT}
              onValueChange={setRequireSGT}
              trackColor={{ false: colors.bgElevated, true: `${colors.ttPrimary}80` }}
              thumbColor={requireSGT ? colors.ttPrimary : colors.textMuted}
            />
          </View>
        </View>

        {/* Funnel Stats */}
        <View style={styles.funnelCard}>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>Total Wallets</Text>
            <Text style={styles.funnelValue}>{stats.total}</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>SGT Verified</Text>
            <Text style={styles.funnelValue}>{stats.sgtVerified}</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={[styles.funnelLabel, { color: colors.success }]}>Passed</Text>
            <Text style={[styles.funnelValue, { color: colors.success }]}>{stats.passed}</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={[styles.funnelLabel, { color: colors.danger }]}>Rejected</Text>
            <Text style={[styles.funnelValue, { color: colors.danger }]}>{stats.rejected}</Text>
          </View>
        </View>

        {/* Results */}
        {results.map((wallet: any) => (
          <View key={wallet.walletAddress} style={[styles.walletRow, wallet.passed && styles.walletRowPassed]}>
            <View style={styles.walletInfo}>
              <Text style={styles.walletAddress}>
                {wallet.walletAddress.slice(0, 6)}...{wallet.walletAddress.slice(-4)}
              </Text>
              <View style={styles.walletSignals}>
                {wallet.hasSGT && <Text style={styles.signalBadge}>SGT</Text>}
                {wallet.trustScore !== null && (
                  <Text style={styles.scoreText}>Score: {wallet.trustScore}</Text>
                )}
              </View>
            </View>
            <Text style={[styles.statusText, wallet.passed ? styles.passedText : styles.rejectedText]}>
              {wallet.passed ? 'PASS' : 'FAIL'}
            </Text>
          </View>
        ))}
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  controlCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  thresholdButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  thresholdButtonActive: {
    backgroundColor: colors.ttPrimary,
  },
  thresholdButtonText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 13,
  },
  thresholdButtonTextActive: {
    color: colors.bgBase,
  },
  funnelCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  funnelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  funnelLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.ui,
    fontSize: 14,
  },
  funnelValue: {
    color: colors.textPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  walletRowPassed: {
    borderLeftColor: colors.success,
  },
  walletInfo: {
    flex: 1,
    gap: 4,
  },
  walletAddress: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  walletSignals: {
    flexDirection: 'row',
    gap: 8,
  },
  signalBadge: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  statusText: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 12,
  },
  passedText: {
    color: colors.success,
  },
  rejectedText: {
    color: colors.danger,
  },
});
