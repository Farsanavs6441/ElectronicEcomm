import React, { useState } from 'react';
import { View, Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';

interface OptimizedImageProps {
  source: { uri: string };
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadius?: number;
  showShimmer?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  testID?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  borderRadius = 8,
  showShimmer = true,
  onLoad,
  onError,
  testID,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  return (
    <View style={[containerStyle, { borderRadius }]} testID={testID}>
      {(loading || error) && showShimmer && (
        <ShimmerPlaceholder
          width='100%'
          height='100%'
          borderRadius={borderRadius}
          style={[StyleSheet.absoluteFillObject, { zIndex: error ? -1 : 1 }]}
        />
      )}

      <Image
        source={source}
        style={[
          style,
          {
            borderRadius,
            opacity: loading ? 0 : 1,
          },
        ]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        testID={testID ? `${testID}-img` : undefined}
        // Optimize image loading
        loadingIndicatorSource={{
          uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
        }}
        fadeDuration={300}
      />

      {error && (
        <View
          style={[styles.errorContainer, { borderRadius }]}
          testID={testID ? `${testID}-error` : undefined}
        >
          <View style={styles.errorPlaceholder}>
            <View style={styles.errorIcon} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default OptimizedImage;
