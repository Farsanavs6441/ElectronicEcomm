import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import ProductCard from '../components/ProductCard';

type FavouritesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favourites'>;

const FavouritesScreen: React.FC = () => {
  const navigation = useNavigation<FavouritesNavigationProp>();
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // First, try to load from cache
      const cachedProducts = await AsyncStorage.getItem('electronicEcomm_products');
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        setAllProducts(products);
        console.log('Loaded products from cache');
        setIsLoading(false);
        return;
      }

      // If no cache, fetch from API and cache the result
      console.log('Fetching products from API...');
      const products = await ApiService.fetchProducts();
      setAllProducts(products);

      // Cache the products
      await AsyncStorage.setItem('electronicEcomm_products', JSON.stringify(products));
      console.log('Products cached successfully');
    } catch (error) {
      console.error('Error loading products:', error);
      // Try to load from cache as fallback
      try {
        const cachedProducts = await AsyncStorage.getItem('electronicEcomm_products');
        if (cachedProducts) {
          const products = JSON.parse(cachedProducts);
          setAllProducts(products);
          console.log('Loaded products from cache as fallback');
        }
      } catch (cacheError) {
        console.error('Error loading from cache:', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('electronicEcomm_favorites');
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavoriteIds(favoriteIds);

        // Filter products based on favorite IDs
        const favoriteProducts = allProducts.filter(product =>
          favoriteIds.includes(product.id)
        );
        setFavourites(favoriteProducts);
      } else {
        setFavourites([]);
        setFavoriteIds([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Update favorites when allProducts or favoriteIds change
  useEffect(() => {
    if (allProducts.length > 0) {
      const favoriteProducts = allProducts.filter(product =>
        favoriteIds.includes(product.id)
      );
      setFavourites(favoriteProducts);
    }
  }, [allProducts, favoriteIds]);

  const removeFavourite = (productId: string) => {
    Alert.alert(
      'Remove Favourite',
      'Are you sure you want to remove this item from favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const newFavorites = favoriteIds.filter(id => id !== productId);
              await AsyncStorage.setItem('electronicEcomm_favorites', JSON.stringify(newFavorites));
              setFavoriteIds(newFavorites);
              setFavourites(prev => prev.filter(item => item.id !== productId));
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
        },
      ]
    );
  };

  const renderFavouriteItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      showFavoriteIcon={true}
      onFavoritePress={removeFavourite}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>♡</Text>
      <Text style={styles.emptyTitle}>No Favourites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start adding products to your favourites to see them here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('ProductList')}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
          <Text style={styles.loadingSubtext}>Gathering your saved items</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favourites</Text>
      {favourites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderFavouriteItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#ccc',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FavouritesScreen;