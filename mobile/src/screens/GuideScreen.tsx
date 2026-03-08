import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { RootStackParamList } from '../navigation/types';

const STEPS = [
  {
    title: 'On-Chain Identity',
    description: 'TrustTap+ builds a trust score from your real Solana activity. No KYC, no personal data. Just on-chain behavior.',
    icon: 'shield',
  },
  {
    title: 'SGT Verification',
    description: 'Owning a Solana Seeker phone gives you the SGT soulbound token, the strongest trust signal worth 25 points.',
    icon: 'device',
  },
  {
    title: '8 Trust Dimensions',
    description: 'Your score is calculated across 8 categories: Device, Financial, Age, Activity, Diversity, DeFi, Identity, and Physical.',
    icon: 'chart',
  },
  {
    title: 'In-Person Meetings',
    description: 'Verify you\'re a real person by scanning QR codes with other Seeker owners. Each meeting boosts your Physical score.',
    icon: 'qr',
  },
  {
    title: 'Level Up',
    description: 'See exactly what actions will improve your trust score. Stake SOL, use DeFi protocols, register a domain, and more.',
    icon: 'arrow',
  },
  {
    title: 'Sybil Shield',
    description: 'Projects can use TrustTap+ to filter bots and sybil attackers from real humans. Trust scores gate access to airdrops and events.',
    icon: 'funnel',
  },
];

function StepIcon({ icon }: { icon: string }) {
  const size = 80;
  const color = colors.ttPrimary;

  return (
    <View style={styles.iconContainer}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Circle cx="40" cy="40" r="38" stroke={color} strokeWidth="1" strokeOpacity={0.3} fill="none" />
        <Circle cx="40" cy="40" r="28" stroke={color} strokeWidth="1.5" strokeOpacity={0.5} fill="none" />
        <Circle cx="40" cy="40" r="6" fill={color} fillOpacity={0.8} />
      </Svg>
    </View>
  );
}

export default function GuideScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < STEPS.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentPage + 1) / STEPS.length) * 100}%` }]} />
      </View>

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {STEPS.map((step, idx) => (
          <View key={idx} style={styles.page}>
            <StepIcon icon={step.icon} />
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </PagerView>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, idx === currentPage && styles.dotActive]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentPage === STEPS.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.bgElevated,
    marginHorizontal: 16,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.ttPrimary,
    borderRadius: 2,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 8,
    zIndex: 1,
  },
  skipText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 14,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  stepTitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgElevated,
  },
  dotActive: {
    backgroundColor: colors.ttPrimary,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.ttPrimary,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 16,
  },
});
