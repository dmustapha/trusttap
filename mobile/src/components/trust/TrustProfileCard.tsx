import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TrustProfile } from '../../types';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import ScoreDial from './ScoreDial';
import ScoreBreakdown from './ScoreBreakdown';
import AISummary from './AISummary';
import BadgeRow from './BadgeRow';
import TipButton from './TipButton';

interface TrustProfileCardProps {
  profile: TrustProfile;
}

export default function TrustProfileCard({ profile }: TrustProfileCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header - always visible */}
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerLeft}>
          <Text style={styles.address}>
            {profile.walletAddress.slice(0, 8)}...{profile.walletAddress.slice(-4)}
          </Text>
          {profile.analysis?.solDomain && (
            <Text style={styles.domain}>{profile.analysis.solDomain}</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.scoreText, { color: profile.color }]}>{profile.score}</Text>
          <Text style={styles.labelText}>{profile.label}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <ScoreDial score={profile.score} label={profile.label} color={profile.color} size={140} />
          <ScoreBreakdown breakdown={profile.breakdown} />
          <AISummary summary={profile.aiSummary} sybilAssessment={profile.sybilAssessment} />
          <BadgeRow badges={profile.badges} />
          <TipButton recipientAddress={profile.walletAddress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  address: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  domain: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontFamily: fonts.display,
    fontSize: 28,
  },
  labelText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
});
