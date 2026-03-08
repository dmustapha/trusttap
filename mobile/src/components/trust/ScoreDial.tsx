import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreDialProps {
  score: number;
  label: string;
  color: string;
  size?: number;
  animate?: boolean;
  revealMode?: 'scramble' | 'snap' | 'normal';
}

export default function ScoreDial({ score, label, color, size = 180, animate = true, revealMode = 'normal' }: ScoreDialProps) {
  const strokeWidth = size > 120 ? 8 : 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const targetOffset = circumference - (clampedScore / 100) * circumference;

  const animatedOffset = useRef(new Animated.Value(circumference)).current;
  const animatedNumber = useRef(new Animated.Value(0)).current;
  const displayNumber = useRef(0);
  const [displayScore, setDisplayScore] = useState(animate ? 0 : clampedScore);

  // Scramble state
  const scrambleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dialOpacity = useRef(new Animated.Value(revealMode === 'scramble' ? 0.6 : 1)).current;
  const labelOpacity = useRef(new Animated.Value(revealMode === 'scramble' ? 0 : 1)).current;

  // Cleanup scramble interval
  const clearScramble = useCallback(() => {
    if (scrambleInterval.current) {
      clearInterval(scrambleInterval.current);
      scrambleInterval.current = null;
    }
  }, []);

  // Scramble mode: random numbers, empty arc, pulsing glow
  useEffect(() => {
    if (revealMode === 'scramble') {
      // Reset arc to empty
      animatedOffset.setValue(circumference);
      dialOpacity.setValue(0.6);
      labelOpacity.setValue(0);

      // Start number scramble at 60ms
      let cycle = 60;
      clearScramble();
      scrambleInterval.current = setInterval(() => {
        setDisplayScore(Math.floor(Math.random() * 90) + 10);
      }, cycle);

      // Slow down to 120ms after 800ms
      const slowDown = setTimeout(() => {
        clearScramble();
        scrambleInterval.current = setInterval(() => {
          setDisplayScore(Math.floor(Math.random() * 90) + 10);
        }, 120);
      }, 800);

      // Pulsing glow on ring
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ])
      );
      glowLoop.start();

      return () => {
        clearTimeout(slowDown);
        clearScramble();
        glowLoop.stop();
      };
    }
  }, [revealMode]);

  // Snap mode: reveal final score with bounce
  const snapAnims = useRef<Animated.CompositeAnimation[]>([]);
  useEffect(() => {
    if (revealMode === 'snap') {
      clearScramble();
      glowAnim.setValue(0);

      // Set final score immediately
      setDisplayScore(clampedScore);

      // Arc fills fast (600ms)
      const arcAnim = Animated.timing(animatedOffset, {
        toValue: targetOffset,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      });

      // Opacity 0.6 → 1.0
      const opacityAnim = Animated.timing(dialOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      });

      // Scale bounce: 1.0 → 1.08 → 1.0
      const bounceAnim = Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]);

      // Label fade in after short delay
      const labelAnim = Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: false,
      });

      snapAnims.current = [arcAnim, opacityAnim, bounceAnim, labelAnim];
      snapAnims.current.forEach(a => a.start());

      return () => {
        snapAnims.current.forEach(a => a.stop());
        snapAnims.current = [];
      };
    }
  }, [revealMode]);

  // Normal mode: existing behavior
  useEffect(() => {
    if (revealMode !== 'normal') return;

    if (!animate) {
      animatedOffset.setValue(targetOffset);
      setDisplayScore(clampedScore);
      dialOpacity.setValue(1);
      labelOpacity.setValue(1);
      return;
    }

    // Reset
    animatedOffset.setValue(circumference);
    animatedNumber.setValue(0);
    setDisplayScore(0);
    dialOpacity.setValue(1);
    labelOpacity.setValue(1);

    // Animate arc
    Animated.timing(animatedOffset, {
      toValue: targetOffset,
      duration: 1200,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Animate number
    Animated.timing(animatedNumber, {
      toValue: clampedScore,
      duration: 1200,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const listener = animatedNumber.addListener(({ value }) => {
      const rounded = Math.round(value);
      if (rounded !== displayNumber.current) {
        displayNumber.current = rounded;
        setDisplayScore(rounded);
      }
    });

    return () => animatedNumber.removeListener(listener);
  }, [score, animate, revealMode]);

  const glowStrokeWidth = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [strokeWidth, strokeWidth + 4],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.container, { width: size, height: size, opacity: dialOpacity, transform: [{ scale: scaleAnim }] }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.bgElevated}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={revealMode === 'scramble' ? glowStrokeWidth : strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          opacity={revealMode === 'scramble' ? glowOpacity : 1}
        />
      </Svg>
      {/* Score text */}
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.scoreText, { fontSize: size > 120 ? 42 : 28, color }]}>{displayScore}</Text>
        <Animated.Text style={[styles.labelText, { fontSize: size > 120 ? 13 : 10, opacity: labelOpacity }]}>{label}</Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: fonts.display,
  },
  labelText: {
    color: colors.textMuted,
    fontFamily: fonts.uiMedium,
    marginTop: 2,
  },
});
