import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Animated } from 'react-native';
import Colors from '../utils/colors';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showLoader = () => {
    setIsLoading(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideLoader = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we fetch your data</Text>
            <View style={styles.dotsContainer}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.dot}>•</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.inactive,
    textAlign: 'center',
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  dot: {
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 3,
  },
});