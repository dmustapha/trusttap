import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface QRGeneratorProps {
  challenge: {
    walletAddress: string;
    timestamp: number;
    nonce: string;
  };
  onBack: () => void;
}

export default function QRGenerator({ challenge, onBack }: QRGeneratorProps) {
  const initialRemaining = Math.max(0, 60 - Math.floor((Date.now() - challenge.timestamp) / 1000));
  const [timeLeft, setTimeLeft] = useState(initialRemaining);
  const qrData = JSON.stringify(challenge);
  const onBackRef = React.useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (initialRemaining <= 0) {
      onBackRef.current();
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - challenge.timestamp) / 1000);
      const remaining = 60 - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        onBackRef.current();
      }
      setTimeLeft(Math.max(0, remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge.timestamp, initialRemaining]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(qrData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <Text style={styles.subtitle}>Show this to your partner to scan</Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={220}
          backgroundColor={colors.textPrimary}
          color={colors.bgBase}
        />
      </View>

      <Text style={[styles.timer, timeLeft <= 10 && styles.timerWarning]}>
        Expires in {timeLeft}s
      </Text>

      <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
        <Text style={styles.copyButtonText}>Copy QR Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
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
  qrContainer: {
    backgroundColor: colors.textPrimary,
    padding: 16,
    borderRadius: 16,
  },
  timer: {
    fontFamily: fonts.uiMedium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  timerWarning: {
    color: colors.danger,
  },
  copyButton: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  copyButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
