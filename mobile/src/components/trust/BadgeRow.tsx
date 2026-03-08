import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { Badge } from '../../types';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface BadgeRowProps {
  badges: Badge[];
}

export default function BadgeRow({ badges }: BadgeRowProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Badges</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        {badges.map(badge => (
          <View key={badge.id} style={[styles.badge, badge.earned && styles.badgeEarned]}>
            <Text style={[styles.badgeName, badge.earned && styles.badgeNameEarned]}>
              {badge.name}
            </Text>
            {badge.earned ? (
              <Text style={styles.earnedText}>Earned</Text>
            ) : (
              <Text style={styles.progressText}>{badge.progress ?? ''}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  scrollView: {
    marginHorizontal: -16,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
  badge: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 12,
    minWidth: 110,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeEarned: {
    borderColor: colors.ttPrimary,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  badgeName: {
    color: colors.textSecondary,
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    marginBottom: 4,
  },
  badgeNameEarned: {
    color: colors.ttPrimary,
  },
  earnedText: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  progressText: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 10,
  },
});
