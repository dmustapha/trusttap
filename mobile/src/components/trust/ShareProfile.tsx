import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

interface ShareProfileProps {
  walletAddress: string;
}

export default function ShareProfile({ walletAddress }: ShareProfileProps) {
  const handleShare = async () => {
    const url = `https://trusttap.vercel.app/profile?wallet=${walletAddress}`;
    try {
      await Share.share({ message: `Check out my TrustTap+ score!\n${url}` });
    } catch {}
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleShare}>
      <Text style={styles.buttonText}>Share Profile</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
});
