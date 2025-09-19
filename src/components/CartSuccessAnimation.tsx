import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface CartSuccessAnimationProps {
  visible: boolean;
  productName: string;
  onAnimationComplete?: () => void;
}

const CartSuccessAnimation: React.FC<CartSuccessAnimationProps> = ({
  visible,
  productName,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Start animation sequence
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 2.5 seconds
      const timer = setTimeout(() => {
        hideAnimation();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations for next use
      fadeAnim.setValue(0);
      slideAnim.setValue(-100);
      scaleAnim.setValue(0.8);
      onAnimationComplete?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Added to Cart!</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {productName}
          </Text>
        </View>
        <View style={styles.cartIconContainer}>
          <Text style={styles.cartIcon}>🛒</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  cartIconContainer: {
    marginLeft: 8,
  },
  cartIcon: {
    fontSize: 20,
  },
});

export default CartSuccessAnimation;