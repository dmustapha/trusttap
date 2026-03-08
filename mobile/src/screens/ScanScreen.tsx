import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { useMeeting } from '../hooks/useMeeting';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import QRGenerator from '../components/meeting/QRGenerator';
import QRScanner from '../components/meeting/QRScanner';
import MeetingConfirm from '../components/meeting/MeetingConfirm';
import MeetingSuccess from '../components/meeting/MeetingSuccess';
import Header from '../components/layout/Header';

export default function ScanScreen() {
  const { publicKey } = useWallet();
  const meeting = useMeeting();
  const [pasteInput, setPasteInput] = useState('');

  const handlePaste = async () => {
    if (pasteInput.trim()) {
      await meeting.handleScan(pasteInput.trim());
      setPasteInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {meeting.state === 'idle' && (
          <View style={styles.idleContent}>
            <Text style={styles.title}>Verify Meeting</Text>
            <Text style={styles.subtitle}>
              Meet another Seeker owner in person and verify each other
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => publicKey && meeting.generateQR(publicKey)}
            >
              <Text style={styles.primaryButtonText}>Show My QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={meeting.startScanning}
            >
              <Text style={styles.secondaryButtonText}>Scan Partner's QR</Text>
            </TouchableOpacity>

            {/* Paste fallback */}
            <View style={styles.pasteContainer}>
              <Text style={styles.pasteLabel}>Or paste QR data:</Text>
              <TextInput
                style={styles.pasteInput}
                value={pasteInput}
                onChangeText={setPasteInput}
                placeholder="Paste QR data here..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
              <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
                <Text style={styles.pasteButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {meeting.state === 'showing_qr' && meeting.challenge && (
          <QRGenerator challenge={meeting.challenge} onBack={meeting.reset} />
        )}

        {meeting.state === 'scanning' && (
          <QRScanner onScan={meeting.handleScan} onBack={meeting.reset} />
        )}

        {meeting.state === 'partner_preview' && (
          <MeetingConfirm
            partnerAddress={meeting.partnerAddress}
            partnerProfile={meeting.partnerProfile}
            onConfirm={() => publicKey && meeting.confirmMeeting(publicKey)}
            onCancel={meeting.reset}
            isSubmitting={false}
          />
        )}

        {meeting.state === 'submitting' && (
          <MeetingConfirm
            partnerAddress={meeting.partnerAddress}
            partnerProfile={meeting.partnerProfile}
            onConfirm={() => {}}
            onCancel={meeting.reset}
            isSubmitting={true}
          />
        )}

        {meeting.state === 'success' && (
          <MeetingSuccess
            updatedScores={meeting.updatedScores}
            partnerAddress={meeting.partnerAddress}
            onDone={meeting.reset}
          />
        )}

        {meeting.state === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{meeting.error}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={meeting.reset}>
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  idleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 16,
  },
  pasteContainer: {
    width: '100%',
    marginTop: 24,
    gap: 8,
  },
  pasteLabel: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  pasteInput: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 12,
    minHeight: 60,
  },
  pasteButton: {
    backgroundColor: colors.bgElevated,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pasteButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
});
