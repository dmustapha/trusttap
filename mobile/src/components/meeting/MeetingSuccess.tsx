import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface MeetingSuccessProps {
  updatedScores: { myScore: number; partnerScore: number } | null;
  partnerAddress: string | null;
  onDone: () => void;
}

export default function MeetingSuccess({ updatedScores, partnerAddress, onDone }: MeetingSuccessProps) {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      <Text style={styles.title}>Meeting Verified!</Text>
      <Text style={styles.subtitle}>
        You've verified a meeting with{'\n'}
        {partnerAddress ? `${partnerAddress.slice(0, 8)}...${partnerAddress.slice(-4)}` : 'another user'}
      </Text>

      {updatedScores && (
        <View style={styles.scoresCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{updatedScores.myScore}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Partner Score</Text>
            <Text style={styles.scoreValue}>{updatedScores.partnerScore}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 40,
    color: colors.ttPrimary,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  scoresCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.ui,
    fontSize: 14,
  },
  scoreValue: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  doneButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
});
