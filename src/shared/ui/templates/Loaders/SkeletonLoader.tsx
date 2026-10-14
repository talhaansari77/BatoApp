// components/states/Skeleton.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type SkeletonProps = {
  rows?: number;
};

export function SkeletonLoader({ rows = 3 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Loading content"
      accessibilityState={{ busy: true }}
    >
      {Array.from({ length: rows }, (_, index) => (
        <Animated.View
          key={index}
          style={[styles.card, { opacity }]}
        >
          <View style={styles.heading} />
          <View style={styles.line} />
          <View style={styles.shortLine} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    gap: 12,
  },
  heading: {
    width: '45%',
    height: 20,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  line: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  shortLine: {
    width: '70%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
});