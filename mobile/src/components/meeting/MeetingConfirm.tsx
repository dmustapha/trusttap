import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { TrustProfile } from '../../types';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import ScoreDial from '../trust/ScoreDial';

interface MeetingConfirmProps {
  partnerAddress: string | null;
  partnerProfile: TrustProfile | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function MeetingConfirm({
  partnerAddress,
  partnerProfile,
  onConfirm,
  onCancel,
  isSubmitting,
}: MeetingConfirmProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Meeting</Text>
      <Text style={styles.subtitle}>Confirm you're with this person</Text>

      {/* Partner info */}
      <View style={styles.partnerCard}>
        <Text style={styles.partnerAddress}>
          {partnerAddress ? `${partnerAddress.slice(0, 8)}...${partnerAddress.slice(-4)}` : 'Unknown'}
        </Text>
        {partnerProfile && (
          <>
            <ScoreDial
              score={partnerProfile.score}
              label={partnerProfile.label}
              color={partnerProfile.color}
              size={120}
            />
            {partnerProfile.analysis?.solDomain && (
              <Text style={styles.domainText}>{partnerProfile.analysis.solDomain}</Text>
            )}
          </>
        )}
      </View>

      {/* Actions */}
      {isSubmitting ? (
        <View style={styles.submittingContainer}>
          <ActivityIndicator size="large" color={colors.ttPrimary} />
          <Text style={styles.submittingText}>Registering meeting...</Text>
        </View>
      ) : (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Meeting</Text>
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 24,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  partnerCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  partnerAddress: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  domainText: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 13,
  },
  submittingContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  submittingText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.ttPrimary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
  },
});
