import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Product } from '../types';
import ApiService from '../services/api';
import { useFavorites } from '../context/FavoritesContext.web';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import OptimizedImage from '../components/OptimizedImage';

interface ProductDetailsScreenWebProps {
  productId: string;
  onBack: () => void;
}

const ProductDetailsScreenWeb: React.FC<ProductDetailsScreenWebProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Helper function to show web notifications safely
  const showNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const NotificationAPI = (window as any).Notification;
      if (NotificationAPI && NotificationAPI.permission === 'granted') {
        new NotificationAPI(title, { body });
      } else {
        }
    } else {
    }
  };

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

    // Web notification instead of Alert
    const message = isCurrentlyFavorite ? 'Removed from favourites' : 'Added to favourites';
    showNotification('Favourites', message);
  };

  const addToCart = () => {
    // Web notification for cart
    showNotification('Cart', 'Product added to cart!');
  };

  if (loading) {
    return <ProductDetailSkeleton showHeader={true} />;
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer}>
          <OptimizedImage
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
            borderRadius={0}
            showShimmer={true}
            onLoad={() => {}}
            onError={() => {}}
          />

          <View style={styles.content}>
            <View style={styles.headerRow}>
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
              <Text style={[styles.stockStatus, { color: product.inStock ? '#4CAF50' : '#FF3B30' }]}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text> */}
            {/* </View> */}

            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.addToCartButton]}
                onPress={addToCart}
                disabled={!product.inStock}
              >
                <Text style={styles.buttonText}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 80, // Same width as back button for centering
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
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
    height: 500,
    resizeMode: 'contain',
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 30,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreenWeb;