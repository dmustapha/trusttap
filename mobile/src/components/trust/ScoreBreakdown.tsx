import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import type { ScoreBreakdown as BreakdownType } from '../../types';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface ScoreBreakdownProps {
  breakdown: BreakdownType;
  animate?: boolean;
}

const CATEGORIES: { key: keyof BreakdownType; label: string; max: number }[] = [
  { key: 'device', label: 'Device (SGT)', max: 25 },
  { key: 'financial', label: 'Financial', max: 10 },
  { key: 'walletAge', label: 'Wallet Age', max: 10 },
  { key: 'activity', label: 'Activity', max: 10 },
  { key: 'diversity', label: 'Diversity', max: 10 },
  { key: 'defi', label: 'DeFi Depth', max: 13 },
  { key: 'identity', label: 'Identity', max: 10 },
  { key: 'physical', label: 'Physical', max: 12 },
];

function AnimatedBar({ pct, delay }: { pct: number; delay: number }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    widthAnim.setValue(0);
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 800,
      delay: 500 + delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct]);

  return (
    <View style={styles.barBg}>
      <Animated.View
        style={[
          styles.barFill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

export default function ScoreBreakdown({ breakdown, animate = true }: ScoreBreakdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Score Breakdown</Text>
      {CATEGORIES.map(({ key, label, max }, index) => {
        const value = breakdown[key];
        const pct = (value / max) * 100;
        return (
          <View key={key} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}/{max}</Text>
            </View>
            {animate ? (
              <AnimatedBar pct={pct} delay={index * 80} />
            ) : (
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: fonts.ui,
    fontSize: 13,
  },
  value: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  barBg: {
    height: 6,
    backgroundColor: colors.bgElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.ttPrimary,
    borderRadius: 3,
  },
});
