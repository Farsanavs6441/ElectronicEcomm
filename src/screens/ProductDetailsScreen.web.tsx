import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Product } from '../types';
import ApiService from '../services/api';
import { useFavorites } from '../context/FavoritesContext.web';
import { useCart } from '../context/CartContext.web';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import OptimizedImage from '../components/OptimizedImage';
import { styles } from '../styles/ProductDetailsWebStyles';

interface ProductDetailsScreenWebProps {
  productId: string;
  onBack: () => void;
}

const ProductDetailsScreenWeb: React.FC<ProductDetailsScreenWebProps> = ({
  productId,
  onBack,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart: addProductToCart } = useCart();

  // State for in-app notifications
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    visible: boolean;
  }>({ title: '', message: '', visible: false });

  // Helper function to show web notifications safely
  const showNotification = (title: string, body: string) => {
    // Try browser notification first
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const NotificationAPI = (window as any).Notification;
      if (NotificationAPI && NotificationAPI.permission === 'granted') {
        new NotificationAPI(title, { body });
        return;
      }
    }

    // Fallback to in-app notification
    setNotification({ title, message: body, visible: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
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
    const message = isCurrentlyFavorite
      ? 'Removed from favourites'
      : 'Added to favourites';
    showNotification('Favourites', message);
  };

  const addToCart = () => {
    if (!product) return;

    // Add product to cart
    addProductToCart(product);

    // Show notification
    showNotification('Cart', `${product.name} added to cart!`);
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
      {/* In-app notification */}
      {notification.visible && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
      )}

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
          resizeMode='contain'
          borderRadius={0}
          showShimmer={true}
          onLoad={() => {}}
          onError={() => {}}
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <TouchableOpacity
              style={[
                styles.favouriteButton,
                {
                  backgroundColor:
                    product && isFavorite(product.id) ? '#FF3B30' : '#007AFF',
                },
              ]}
              onPress={toggleFavourite}
            >
              <Text style={styles.favouriteButtonText}>
                {product && isFavorite(product.id)
                  ? '❤ Remove from Favourites'
                  : '♡ Add to Favourites'}
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
              style={[
                styles.button,
                styles.addToCartButton,
                product.inStock === false && { backgroundColor: '#ccc', opacity: 0.6 }
              ]}
              onPress={addToCart}
              disabled={product.inStock === false}
            >
              <Text style={[
                styles.buttonText,
                product.inStock === false && { color: '#666' }
              ]}>
                {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailsScreenWeb;
