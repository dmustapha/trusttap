import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface AISummaryProps {
  summary: string;
  sybilAssessment: string;
}

const ASSESSMENT_COLORS: Record<string, string> = {
  'HUMAN': colors.success,
  'LIKELY HUMAN': colors.ttPrimary,
  'UNCERTAIN': colors.warning,
  'LIKELY BOT': colors.danger,
  'BOT': colors.danger,
};

export default function AISummary({ summary, sybilAssessment }: AISummaryProps) {
  if (!summary || summary === 'Generating trust analysis...') {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>AI Analysis</Text>
        <Text style={styles.generating}>Generating trust analysis...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>AI Analysis</Text>
      <Text style={styles.summary}>{summary}</Text>
      {sybilAssessment && (
        <View style={styles.assessmentRow}>
          <Text style={styles.assessmentLabel}>Sybil Assessment:</Text>
          <Text style={[styles.assessmentValue, { color: ASSESSMENT_COLORS[sybilAssessment] || colors.textMuted }]}>
            {sybilAssessment}
          </Text>
        </View>
      )}
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
  generating: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    fontStyle: 'italic',
  },
  summary: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  assessmentLabel: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  assessmentValue: {
    fontFamily: fonts.uiSemiBold,
    fontSize: 12,
  },
});
