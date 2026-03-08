import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useWallet } from '../../context/WalletContext';
import { TIP_AMOUNTS } from '../../lib/sol-tip';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface TipButtonProps {
  recipientAddress: string;
}

export default function TipButton({ recipientAddress }: TipButtonProps) {
  const { publicKey, isDemoMode } = useWallet();
  const [showAmounts, setShowAmounts] = useState(false);
  const [sending, setSending] = useState(false);

  const handleTip = async (amount: number) => {
    setSending(true);
    try {
      if (isDemoMode) {
        // Simulate delay for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Tip Sent!', `${amount} SOL sent (demo mode)`);
      } else {
        // TODO: Real MWA transaction
        Alert.alert('Coming Soon', 'Real SOL tipping via MWA');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send tip');
    } finally {
      setSending(false);
      setShowAmounts(false);
    }
  };

  if (!publicKey || publicKey === recipientAddress) return null;

  return (
    <View style={styles.container}>
      {!showAmounts ? (
        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => setShowAmounts(true)}
        >
          <Text style={styles.tipButtonText}>Tip SOL</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.amountsRow}>
          {TIP_AMOUNTS.map(amount => (
            <TouchableOpacity
              key={amount}
              style={styles.amountButton}
              onPress={() => handleTip(amount)}
              disabled={sending}
            >
              <Text style={styles.amountText}>{amount} SOL</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAmounts(false)}
          >
            <Text style={styles.cancelText}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tipButton: {
    backgroundColor: colors.ttPrimary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  tipButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
  },
  amountsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  amountButton: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.ttPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  amountText: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 18,
  },
});
