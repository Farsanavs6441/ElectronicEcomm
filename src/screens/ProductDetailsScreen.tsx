import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import ApiService from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ProgressiveImage from '../components/ProgressiveImage';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const navigation = useNavigation<ProductDetailsNavigationProp>();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart: addProductToCart, isInCart, getCartItemQuantity } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProduct = await ApiService.fetchProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = () => {
    if (!product) return;

    const isCurrentlyFavorite = isFavorite(product.id);
    toggleFavorite(product.id);

    Alert.alert(
      'Favourites',
      isCurrentlyFavorite ? 'Removed from favourites' : 'Added to favourites'
    );
  };

  const addToCart = () => {
    if (product) {
      addProductToCart(product);
      Alert.alert('Success', `${product.name} added to cart!`, [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', style: 'default', onPress: () => {
          // TODO: Navigate to cart screen
        }}
      ]);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton showHeader={false} />;
  }

  if (error || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ProgressiveImage
        source={{ uri: product.image }}
        style={styles.productImage}
        containerStyle={undefined}
        resizeMode="cover"
        borderRadius={0}
        onLoad={() => {}}
        onError={() => {}}
        priority="high"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.name}</Text>
          <TouchableOpacity onPress={toggleFavourite}>
            <Text style={[styles.favouriteIcon, { color: product && isFavorite(product.id) ? '#FF3B30' : '#ccc' }]}>
              {product && isFavorite(product.id) ? '❤' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>

        {/* <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {product.rating}</Text>
        </View> */}

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addToCartButton]}
            onPress={addToCart}
            disabled={!product.inStock}
          >
            <Text style={styles.buttonText}>
              {'Add to Cart' }
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.button, styles.buyNowButton]}
            onPress={() => Alert.alert('Purchase', 'Redirecting to checkout...')}
            disabled={!product.inStock}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favouriteIcon: {
    fontSize: 24,
    marginLeft: 16,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
  },
  stockStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#34C759',
  },
  buyNowButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;