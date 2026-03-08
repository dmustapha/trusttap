import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Meeting } from '../../types';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface MeetingHistoryProps {
  meetings: Meeting[];
}

export default function MeetingHistory({ meetings }: MeetingHistoryProps) {
  if (!meetings || meetings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Meeting History</Text>
        <Text style={styles.emptyText}>No verified meetings yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Meeting History</Text>
      {meetings.map((meeting, idx) => (
        <View key={meeting.id || idx} style={styles.meetingRow}>
          <View style={styles.meetingDot} />
          <View style={styles.meetingInfo}>
            <Text style={styles.partnerAddress}>
              {meeting.walletB.slice(0, 6)}...{meeting.walletB.slice(-4)}
            </Text>
            <Text style={styles.meetingDate}>
              {new Date(meeting.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.verifiedBadge}>
            {meeting.verified ? 'Verified' : 'Pending'}
          </Text>
        </View>
      ))}
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
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    fontStyle: 'italic',
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  meetingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ttPrimary,
  },
  meetingInfo: {
    flex: 1,
  },
  partnerAddress: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  meetingDate: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
  },
});
