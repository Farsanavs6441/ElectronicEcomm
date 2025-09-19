import React, { useState, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';

interface ProgressiveImageProps {
  source: { uri: string };
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadius?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: 'high' | 'normal' | 'low';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  borderRadius = 8,
  placeholder,
  onLoad,
  onError,
  priority = 'normal',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageOpacity] = useState(new Animated.Value(0));

  const handleLoad = () => {
    setLoading(false);
    setError(false);

    // Smooth fade-in animation
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  // Generate optimized image URL based on container size
  const getOptimizedImageUrl = (originalUrl: string, width: number = 300) => {
    // For production, you might want to use a service like Cloudinary or ImageKit
    // For now, we'll use the original URL
    return originalUrl;
  };

  const imageUrl =
    typeof style === 'object' && style?.width
      ? getOptimizedImageUrl(source.uri, style.width as number)
      : source.uri;

  return (
    <View style={[containerStyle, { borderRadius, overflow: 'hidden' }]}>
      {/* Shimmer placeholder */}
      {loading && (
        <ShimmerPlaceholder
          width='100%'
          height='100%'
          borderRadius={0} // Already handled by container
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Low-quality placeholder (if provided) */}
      {placeholder && loading && (
        <Animated.Image
          source={{ uri: placeholder }}
          style={[
            style,
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 0, // Already handled by container
              opacity: 0.3,
            },
          ]}
          resizeMode={resizeMode}
          blurRadius={2}
        />
      )}

      {/* Main image */}
      <Animated.Image
        source={{ uri: imageUrl }}
        style={[
          style,
          {
            borderRadius: 0, // Already handled by container
            opacity: imageOpacity,
          },
        ]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        // Performance optimizations
        {...(priority === 'high' && { priority: 'high' })}
        fadeDuration={0} // We handle fade-in with Animated.Value
      />

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#ddd',
    borderRadius: 16,
  },
});

export default ProgressiveImage;
