import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useWallet } from '../context/WalletContext';
import { useTrustProfile } from '../hooks/useTrustProfile';
import { useFirstVisit } from '../hooks/useFirstVisit';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import ScoreDial from '../components/trust/ScoreDial';
import ScoreBreakdown from '../components/trust/ScoreBreakdown';
import AISummary from '../components/trust/AISummary';
import BadgeRow from '../components/trust/BadgeRow';
import MeetingHistory from '../components/trust/MeetingHistory';
import TipButton from '../components/trust/TipButton';
import Header from '../components/layout/Header';

type RevealPhase = 'skeleton' | 'calculating' | 'revealing' | 'complete' | 'instant';

function haptic(style: 'light' | 'medium' | 'success') {
  try {
    if (style === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(
        style === 'light' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
      );
    }
  } catch {}
}

function PulsingBar({ width, delay = 0 }: { width: string; delay?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[styles.skeletonBar, { width: width as any, opacity }]} />;
}

function PulsingDial() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.6, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.02, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.3, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.95, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[styles.skeletonDial, { opacity, transform: [{ scale }] }]}>
      <View style={styles.skeletonDialInner} />
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const { publicKey, disconnect, hasSGT } = useWallet();
  const navigation = useNavigation();
  const { profile, loading, error, refresh } = useTrustProfile(publicKey);
  const { hasVisited, markVisited, ready } = useFirstVisit();

  // Reveal state machine
  const [revealPhase, setRevealPhase] = useState<RevealPhase>('skeleton');
  const prevLoading = useRef(true);
  const mountedRef = useRef(true);

  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  // Section cascade animations (opacity + translateY pairs)
  const breakdownAnim = useRef({ opacity: new Animated.Value(0), translateY: new Animated.Value(20) }).current;
  const summaryAnim = useRef({ opacity: new Animated.Value(0), translateY: new Animated.Value(20) }).current;
  const badgeAnim = useRef({ opacity: new Animated.Value(0), translateY: new Animated.Value(20) }).current;
  const remainingAnim = useRef({ opacity: new Animated.Value(0), translateY: new Animated.Value(20) }).current;

  // Status text during calculating phase
  const [statusText, setStatusText] = useState('Analyzing on-chain data...');

  // Transition: loading → data arrived (gated on AsyncStorage ready)
  useEffect(() => {
    if (prevLoading.current && !loading && profile && ready) {
      prevLoading.current = false;

      if (hasVisited('profile')) {
        // Return visit: skip drama
        setRevealPhase('instant');
        breakdownAnim.opacity.setValue(1);
        breakdownAnim.translateY.setValue(0);
        summaryAnim.opacity.setValue(1);
        summaryAnim.translateY.setValue(0);
        badgeAnim.opacity.setValue(1);
        badgeAnim.translateY.setValue(0);
        remainingAnim.opacity.setValue(1);
        remainingAnim.translateY.setValue(0);
      } else {
        // First visit: begin the drama
        setRevealPhase('calculating');
        haptic('light');

        // T+800ms: change status text
        const textTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          setStatusText('Calculating trust score...');
        }, 800);

        // T+1200ms: THE REVEAL
        const revealTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          setRevealPhase('revealing');
          haptic('success');
        }, 1200);

        // T+1800ms: ScoreBreakdown cascades in
        const breakdownTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          haptic('light');
          Animated.parallel([
            Animated.timing(breakdownAnim.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(breakdownAnim.translateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start();
        }, 1800);

        // T+2200ms: AI Summary cascades in
        const summaryTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          Animated.parallel([
            Animated.timing(summaryAnim.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(summaryAnim.translateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start();
        }, 2200);

        // T+2500ms: BadgeRow cascades in
        const badgeTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          if (profile.badges && profile.badges.length > 0) {
            haptic('medium');
          }
          Animated.parallel([
            Animated.timing(badgeAnim.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(badgeAnim.translateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start();
        }, 2500);

        // T+2800ms: Remaining content + mark complete
        const completeTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          Animated.parallel([
            Animated.timing(remainingAnim.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(remainingAnim.translateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]).start(() => {
            if (!mountedRef.current) return;
            setRevealPhase('complete');
            markVisited('profile');
          });
        }, 2800);

        return () => {
          clearTimeout(textTimer);
          clearTimeout(revealTimer);
          clearTimeout(breakdownTimer);
          clearTimeout(summaryTimer);
          clearTimeout(badgeTimer);
          clearTimeout(completeTimer);
        };
      }
    }
    if (loading) {
      prevLoading.current = true;
    }
  }, [loading, profile, ready]);

  const handleShare = async () => {
    if (!publicKey) return;
    const url = `https://trusttap.vercel.app/profile?wallet=${publicKey}`;
    try {
      await Share.share({ message: `Check out my TrustTap+ score!\n${url}` });
    } catch {}
  };

  const handleCopyAddress = async () => {
    if (publicKey) {
      await Clipboard.setStringAsync(publicKey);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Landing' }] })
    );
  };

  // Loading skeleton
  if (loading || revealPhase === 'skeleton') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header />
        <View style={styles.skeletonContainer}>
          <PulsingDial />
          <View style={styles.skeletonBarsGroup}>
            <Text style={styles.skeletonLabel}>Score Breakdown</Text>
            {[
              { w: '90%', d: 0 }, { w: '60%', d: 100 }, { w: '75%', d: 200 }, { w: '50%', d: 300 },
              { w: '40%', d: 400 }, { w: '85%', d: 500 }, { w: '55%', d: 600 }, { w: '65%', d: 700 },
            ].map((bar, i) => (
              <PulsingBar key={i} width={bar.w} delay={bar.d} />
            ))}
          </View>
          <View style={styles.skeletonSummaryBox}>
            <PulsingBar width="100%" delay={200} />
            <PulsingBar width="80%" delay={300} />
            <PulsingBar width="60%" delay={400} />
          </View>
          <Text style={styles.loadingText}>Analyzing wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.loadingText}>No profile data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCalculating = revealPhase === 'calculating';
  const showContent = revealPhase === 'revealing' || revealPhase === 'complete' || revealPhase === 'instant';
  const isInstant = revealPhase === 'instant';

  // Determine ScoreDial revealMode
  const dialRevealMode: 'scramble' | 'snap' | 'normal' = isCalculating ? 'scramble' : revealPhase === 'revealing' ? 'snap' : 'normal';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Wallet Address + SGT Badge */}
        <TouchableOpacity onPress={handleCopyAddress} style={styles.addressContainer}>
          <View>
            <Text style={styles.addressLabel}>Wallet</Text>
            <Text style={styles.addressText}>
              {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : ''}
            </Text>
          </View>
          {hasSGT && (
            <View style={styles.sgtBadge}>
              <Text style={styles.sgtBadgeText}>SGT Verified</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Score Dial */}
        <ScoreDial
          score={profile.score}
          label={profile.label}
          color={profile.color}
          revealMode={dialRevealMode}
          animate={!isInstant}
        />

        {/* Status text during calculating phase */}
        {isCalculating && (
          <Text style={styles.statusText}>{statusText}</Text>
        )}

        {/* Score Trend */}
        {showContent &&
          profile.scoreHistory && profile.scoreHistory.length >= 2 && (() => {
            const prev = profile.scoreHistory[profile.scoreHistory.length - 2].score;
            const diff = profile.score - prev;
            if (diff === 0) return null;
            const isUp = diff > 0;
            return (
              <View style={styles.trendContainer}>
                <Text style={[styles.trendArrow, { color: isUp ? colors.ttPrimary : colors.danger }]}>
                  {isUp ? '\u2191' : '\u2193'}
                </Text>
                <Text style={[styles.trendText, { color: isUp ? colors.ttPrimary : colors.danger }]}>
                  {isUp ? '+' : ''}{diff} from last analysis
                </Text>
                <Text style={styles.trendPrev}> (was {prev})</Text>
              </View>
            );
          })()}

        {/* Score Breakdown — cascaded */}
        {showContent && (
          <Animated.View style={{ opacity: breakdownAnim.opacity, transform: [{ translateY: breakdownAnim.translateY }] }}>
            <ScoreBreakdown breakdown={profile.breakdown} animate={!isInstant} />
          </Animated.View>
        )}

        {/* AI Summary — cascaded */}
        {showContent && (
          <Animated.View style={{ opacity: summaryAnim.opacity, transform: [{ translateY: summaryAnim.translateY }] }}>
            <AISummary summary={profile.aiSummary} sybilAssessment={profile.sybilAssessment} />
          </Animated.View>
        )}

        {/* Badges — cascaded */}
        {showContent && (
          <Animated.View style={{ opacity: badgeAnim.opacity, transform: [{ translateY: badgeAnim.translateY }] }}>
            <BadgeRow badges={profile.badges} />
          </Animated.View>
        )}

        {/* Remaining content — cascaded */}
        {showContent && (
          <Animated.View style={{ opacity: remainingAnim.opacity, transform: [{ translateY: remainingAnim.translateY }] }}>
            {/* Info Link */}
            <TouchableOpacity
              style={styles.infoLink}
              onPress={() => navigation.dispatch(CommonActions.navigate('Badges'))}
            >
              <Text style={styles.infoLinkText}>How are scores & badges calculated?</Text>
            </TouchableOpacity>

            {/* Meeting History */}
            <MeetingHistory meetings={profile.meetingHistory} />

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>
              <TipButton recipientAddress={profile.walletAddress} />
            </View>

            {/* Disconnect */}
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectText}>Disconnect Wallet</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  skeletonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    gap: 10,
  },
  skeletonDial: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.bgSurface,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bgElevated,
  },
  skeletonDialInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.bgBase,
  },
  skeletonBarsGroup: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  skeletonLabel: {
    color: colors.textMuted,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  skeletonBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgSurface,
    alignSelf: 'flex-start',
  },
  skeletonSummaryBox: {
    width: '100%',
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 16,
    gap: 10,
  },
  loadingText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    marginTop: 16,
  },
  statusText: {
    color: colors.ttPrimary,
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 16,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  addressLabel: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 12,
  },
  addressText: {
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 14,
    marginTop: 2,
  },
  sgtBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sgtBadgeText: {
    color: colors.ttPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 11,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  trendArrow: {
    fontFamily: fonts.display,
    fontSize: 16,
    marginRight: 4,
  },
  trendText: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  trendPrev: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  infoLink: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  infoLinkText: {
    color: colors.ttPrimary,
    fontFamily: fonts.ui,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  shareButton: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 14,
  },
  disconnectButton: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  disconnectText: {
    color: colors.textMuted,
    fontFamily: fonts.ui,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
