import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import ApiService from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoading } from '../context/LoadingContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ProgressiveImage from '../components/ProgressiveImage';
import { commonStyles } from '../styles/commonStyles';
import { styles as screenStyles } from '../styles/ProductListScreenStyles';
import { combineStyles } from '../utils/styleHelpers';

type ProductListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading: setGlobalLoading } = useLoading();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { cartCount } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const refreshProducts = async () => {
    try {
      setGlobalLoading(true);
      setError(null);

      // Clear cache and fetch fresh data
      await AsyncStorage.removeItem('electronicEcomm_products');

      const fetchedProducts = await ApiService.fetchProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);

      // Cache the fresh products
      await AsyncStorage.setItem(
        'electronicEcomm_products',
        JSON.stringify(fetchedProducts),
      );
    } catch (err) {
      setError('Failed to refresh products. Please try again.');
      console.error('Error refreshing products:', err);
    } finally {
      setGlobalLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setGlobalLoading(true);
      setError(null);

      // First, try to load from cache
      const cachedProducts = await AsyncStorage.getItem(
        'electronicEcomm_products',
      );
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        setProducts(products);
        setFilteredProducts(products);
        setIsLoading(false);
        setGlobalLoading(false);
        return;
      }

      // If no cache, fetch from API and cache the result
      const fetchedProducts = await ApiService.fetchProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);

      // Cache the products
      await AsyncStorage.setItem(
        'electronicEcomm_products',
        JSON.stringify(fetchedProducts),
      );
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);

      // Try to load from cache as fallback
      try {
        const cachedProducts = await AsyncStorage.getItem(
          'electronicEcomm_products',
        );
        if (cachedProducts) {
          const products = JSON.parse(cachedProducts);
          setProducts(products);
          setFilteredProducts(products);
          setError(null); // Clear error since we have cached data
        }
      } catch (cacheError) {
        console.error('Error loading from cache:', cacheError);
      }
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const renderProduct = ({ item }: { item: Product }) => {
    const isItemFavorite = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate('ProductDetails', { productId: item.id })
        }
      >
        <View style={styles.imageContainer}>
          <ProgressiveImage
            source={{ uri: item.image }}
            style={styles.productImage}
            containerStyle={styles.imageContainer}
            resizeMode='cover'
            borderRadius={8}
            onLoad={() => {}}
            onError={() => {}}
            priority='normal'
          />
          {/* <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={[styles.favoriteIcon, { color: isItemFavorite ? '#FF3B30' : '#666' }]}>
              {isItemFavorite ? '\u2764' : '\u2661'}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state during initial fetch
  if (isLoading && products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Products</Text>
        <FlatList
          data={Array(6).fill(null)}
          renderItem={() => <ProductCardSkeleton isMobile={true} />}
          keyExtractor={(_, index) => `skeleton-${index}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        />
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Products</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder='Search products...'
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredProducts.length === 0 &&
      products.length > 0 &&
      searchText.length > 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No products found</Text>
          <Text style={styles.emptyStateSubtitle}>
            No products match "{searchText}". Try adjusting your search.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={6}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor='#007AFF'
            />
          }
          getItemLayout={(data, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
        />
      )}
    </View>
  );
};

// Combine common styles with screen-specific styles
const styles = combineStyles(commonStyles, screenStyles);

export default ProductListScreen;
