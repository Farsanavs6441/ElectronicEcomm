import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import ApiService from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoading } from '../context/LoadingContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ProgressiveImage from '../components/ProgressiveImage';

type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    loadProducts();
  }, []);


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
      await AsyncStorage.setItem('electronicEcomm_products', JSON.stringify(fetchedProducts));
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
      const cachedProducts = await AsyncStorage.getItem('electronicEcomm_products');
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
      await AsyncStorage.setItem('electronicEcomm_products', JSON.stringify(fetchedProducts));
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);

      // Try to load from cache as fallback
      try {
        const cachedProducts = await AsyncStorage.getItem('electronicEcomm_products');
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
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const renderProduct = ({ item }: { item: Product }) => {
    const isItemFavorite = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      >
        <View style={styles.imageContainer}>
          <ProgressiveImage
            source={{ uri: item.image }}
            style={styles.productImage}
            containerStyle={styles.imageContainer}
            resizeMode="cover"
            borderRadius={8}
            onLoad={() => {}}
            onError={() => {}}
            priority="normal"
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
      <Text style={styles.header}>Products</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredProducts.length === 0 && products.length > 0 && searchText.length > 0 ? (
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
          getItemLayout={(data, index) => (
            {length: 200, offset: 200 * index, index}
          )}
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
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '98%',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  productInfo: {
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'left',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  favouritesButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  favouritesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productsList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProductListScreen;