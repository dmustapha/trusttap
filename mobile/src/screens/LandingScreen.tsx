import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWallet } from '../context/WalletContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { connected, connect, isConnecting } = useWallet();

  useEffect(() => {
    if (connected) {
      navigation.replace('MainTabs');
    }
  }, [connected, navigation]);

  const handleConnect = async () => {
    await connect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Trust Rings */}
        <View style={styles.ringsContainer}>
          <Svg width={width * 0.55} height={width * 0.55} viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r="90" stroke={colors.ttPrimary} strokeWidth="0.5" strokeOpacity={0.2} fill="none" />
            <Circle cx="100" cy="100" r="70" stroke={colors.ttPrimary} strokeWidth="0.5" strokeOpacity={0.3} fill="none" />
            <Circle cx="100" cy="100" r="50" stroke={colors.ttPrimary} strokeWidth="1" strokeOpacity={0.4} fill="none" />
            <Circle cx="100" cy="100" r="30" stroke={colors.ttPrimary} strokeWidth="1.5" strokeOpacity={0.6} fill="none" />
            <Circle cx="100" cy="100" r="8" fill={colors.ttPrimary} fillOpacity={0.8} />
          </Svg>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>TrustTap+</Text>
        <Text style={styles.tagline}>On-chain trust, verified in person</Text>

        {/* Badge Pills */}
        <View style={styles.badgePills}>
          {['Seeker Device', 'Solana Mobile', 'SGT Gated'].map(label => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Connect Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            <Text style={styles.connectButtonText}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>

          {/* Guide Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Guide')} style={{ alignItems: 'center' }}>
            <Text style={styles.guideLink}>What is TrustTap+?</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ringsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  badgePills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 48,
  },
  bottomSection: {
    width: '100%',
  },
  pill: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 44,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
  guideLink: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
