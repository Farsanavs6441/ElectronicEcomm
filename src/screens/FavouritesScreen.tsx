import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLoading } from '../context/LoadingContext';
import { commonStyles } from '../styles/commonStyles';
import { combineStyles } from '../utils/styleHelpers';

type FavouritesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favourites'
>;

const FavouritesScreen: React.FC = () => {
  const navigation = useNavigation<FavouritesNavigationProp>();
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    await loadFavorites();
    setRefreshing(false);
  };

  const loadProducts = async () => {
    try {
      setGlobalLoading(true);

      // First, try to load from cache
      const cachedProducts = await AsyncStorage.getItem(
        'electronicEcomm_products',
      );
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        setAllProducts(products);
        setGlobalLoading(false);
        return;
      }

      // If no cache, fetch from API and cache the result
      const products = await ApiService.fetchProducts();
      setAllProducts(products);

      // Cache the products
      await AsyncStorage.setItem(
        'electronicEcomm_products',
        JSON.stringify(products),
      );
    } catch (error) {
      console.error('Error loading products:', error);
      // Try to load from cache as fallback
      try {
        const cachedProducts = await AsyncStorage.getItem(
          'electronicEcomm_products',
        );
        if (cachedProducts) {
          const products = JSON.parse(cachedProducts);
          setAllProducts(products);
        }
      } catch (cacheError) {
        console.error('Error loading from cache:', cacheError);
      }
    } finally {
      setGlobalLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(
        'electronicEcomm_favorites',
      );
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavoriteIds(favoriteIds);

        // Filter products based on favorite IDs
        const favoriteProducts = allProducts.filter(product =>
          favoriteIds.includes(product.id),
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
        favoriteIds.includes(product.id),
      );
      setFavourites(favoriteProducts);
    }
  }, [allProducts, favoriteIds]);

  const removeFavourite = async (productId: string) => {
    try {
      const newFavorites = favoriteIds.filter(id => id !== productId);
      await AsyncStorage.setItem(
        'electronicEcomm_favorites',
        JSON.stringify(newFavorites),
      );
      setFavoriteIds(newFavorites);
      setFavourites(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFavouriteItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() =>
        navigation.navigate('ProductDetails', { productId: item.id })
      }
      showFavoriteIcon={true}
      isFavorite={true}
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
        style={styles.primaryButton}
        onPress={() => navigation.navigate('ProductList')}
      >
        <Text style={styles.buttonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favourites</Text>
      {favourites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderFavouriteItem}
          keyExtractor={item => item.id}
        //  numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          //columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor='#007AFF'
            />
          }
        />
      )}
    </View>
  );
};

// Use common styles with proper typing
const styles = combineStyles(commonStyles);

export default FavouritesScreen;
