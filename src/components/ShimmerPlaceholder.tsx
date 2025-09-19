import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  DimensionValue,
} from 'react-native';

interface ShimmerPlaceholderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  testID?: string;
}

const ShimmerPlaceholder: React.FC<ShimmerPlaceholderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  testID,
}) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 80,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Shimmer wave animation
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    // Moving gradient animation
    const translateAnimation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    shimmerAnimation.start();
    translateAnimation.start();

    return () => {
      shimmerAnimation.stop();
      translateAnimation.stop();
    };
  }, [shimmerValue, scaleValue, translateX]);

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const gradientOpacity = shimmerValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
            borderRadius,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmerGradient,
          {
            opacity: gradientOpacity,
            borderRadius,
            transform: [{ translateX }],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  shimmerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    opacity: 0.4,
    width: '30%',
  },
});

export default ShimmerPlaceholder;
