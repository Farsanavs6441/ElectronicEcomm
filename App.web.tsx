import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from './src/utils/colors';
import ApiService from './src/services/api';
import { Product } from './src/types';
import ProductDetailsScreenWeb from './src/screens/ProductDetailsScreen.web';
import { FavoritesProvider } from './src/context/FavoritesContext.web';
import ProductCardSkeleton from './src/components/ProductCardSkeleton';
import ProductDetailSkeleton from './src/components/ProductDetailSkeleton';
import OptimizedImage from './src/components/OptimizedImage';

function App(): React.JSX.Element {
  console.log('App rendering...');

  const [showSplash, setShowSplash] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<'products' | 'favorites'>('products');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'productDetail'>('home');

  React.useEffect(() => {
    console.log('App mounting with URL:', window.location.pathname);

    // Check for deep links immediately on mount
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      console.log('Initial path check:', path);

      if (path.startsWith('/product/')) {
        console.log('Deep link detected on mount, skipping splash');
        // Skip splash screen for deep links
        setShowSplash(false);
        loadProducts();
        loadFavorites();
        // Give a small delay to ensure state is set
        setTimeout(() => handleDeepLink(), 100);
        return;
      }
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      loadProducts();
      loadFavorites();
      handleDeepLink();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle deep linking from URL
  const handleDeepLink = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const productMatch = path.match(/^\/product\/(.+)$/);

      if (productMatch) {
        const productId = productMatch[1];
        console.log('Deep link detected for product:', productId);

        // Check if we need to load a different product
        if (!selectedProduct || selectedProduct.id !== productId) {
          console.log('Loading new product:', productId, 'Current product:', selectedProduct?.id);
          openProductDetailById(productId);
        } else {
          console.log('Product already loaded:', productId);
        }
      } else if (path === '/' || path === '') {
        // Navigate to home screen only if not already there
        if (currentScreen !== 'home') {
          setCurrentScreen('home');
          setSelectedProduct(null);
        }
      }
    }
  }, [products, selectedProduct, currentScreen]);

  // Handle browser back/forward navigation and URL changes
  React.useEffect(() => {
    const handlePopState = () => {
      console.log('popstate event fired');
      handleDeepLink();
    };

    const handleFocus = () => {
      console.log('window focus event fired');
      handleDeepLink();
    };

    const handlePageShow = () => {
      console.log('pageshow event fired');
      handleDeepLink();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('pageshow', handlePageShow);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('pageshow', handlePageShow);
      };
    }
  }, [handleDeepLink]);

  // Check for URL changes periodically
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastPathname = window.location.pathname;

    const checkURLChange = () => {
      const currentPathname = window.location.pathname;
      if (currentPathname !== lastPathname) {
        console.log('URL changed from', lastPathname, 'to', currentPathname);
        lastPathname = currentPathname;
        handleDeepLink();
      }
    };

    const interval = setInterval(checkURLChange, 500);

    return () => {
      clearInterval(interval);
    };
  }, [handleDeepLink]);

  const openProductDetailById = async (productId: string) => {
    console.log('openProductDetailById called with ID:', productId, 'Type:', typeof productId);
    try {
      setLoading(true);
      setError(null);
      let product: Product | null = null;

      console.log('Current products array length:', products.length);

      // First try to find in existing products
      if (products.length > 0) {
        product = products.find(p => {
          console.log('Comparing:', p.id, 'with', productId, 'Match:', p.id === productId);
          return p.id === productId;
        }) || null;
        console.log('Found in existing products:', !!product);
      }

      // If not found or products not loaded, fetch fresh data
      if (!product) {
        console.log('Fetching fresh products from API...');
        const fetchedProducts = await ApiService.fetchProducts();
        console.log('Fetched products count:', fetchedProducts.length);

        // Log first few products to see their IDs
        console.log('First 5 product IDs:', fetchedProducts.slice(0, 5).map(p => ({ id: p.id, name: p.name })));

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        product = fetchedProducts.find(p => {
          console.log('Comparing fetched:', p.id, 'with', productId, 'Match:', p.id === productId);
          return p.id === productId;
        }) || null;
        console.log('Found in fetched products:', !!product);
      }

      if (product) {
        console.log('Setting selected product:', product.name);
        setSelectedProduct(product);
        setCurrentScreen('productDetail');
        console.log('Deep link successful - navigating to product:', productId);
        // Update URL without page reload (only if different)
        if (typeof window !== 'undefined' && window.location.pathname !== `/product/${productId}`) {
          (window as any).history.replaceState(null, '', `/product/${productId}`);
        }
      } else {
        console.error('Product not found:', productId);
        console.log('Available product IDs:', products.map(p => p.id));
        setError(`Product with ID "${productId}" not found`);
        setCurrentScreen('home');
        setSelectedProduct(null);
        // Navigate back to products page if product not found
        if (typeof window !== 'undefined') {
          (window as any).history.replaceState(null, '', '/');
        }
      }
    } catch (error) {
      console.error('Error loading product for deep link:', error);
      setError('Failed to load product');
      setCurrentScreen('home');
      setSelectedProduct(null);
      if (typeof window !== 'undefined') {
        (window as any).history.replaceState(null, '', '/');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('electronicEcomm_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = (newFavorites: string[]) => {
    try {
      localStorage.setItem('electronicEcomm_favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    saveFavorites(newFavorites);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetail');
    // Update URL to reflect product detail view
    if (typeof window !== 'undefined') {
      (window as any).history.pushState(null, '', `/product/${product.id}`);
    }
  };

  const goBackToHome = () => {
    setCurrentScreen('home');
    setSelectedProduct(null);
    // Return to main products view in URL
    if (typeof window !== 'undefined') {
      (window as any).history.pushState(null, '', '/');
    }
  };

  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await ApiService.fetchProducts();

      // Ensure we have valid product data
      const validProducts = Array.isArray(fetchedProducts) ? fetchedProducts.filter(product =>
        product && typeof product === 'object' && product.id
      ) : [];

      setProducts(validProducts);
      setFilteredProducts(validProducts);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
      // Set empty arrays on error
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const filtered = products.filter(product =>
      product && product.name &&
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <View style={styles.splashContainer}>
          <Text style={styles.title}>ElectronicEcomm</Text>
          <Text style={styles.subtitle}>Your Electronics Store</Text>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => {
    // Add safety checks for undefined values
    const price = typeof item.price === 'number' ? item.price : 0;
    const name = item.name || 'Unknown Product';
    const image = item.image || '';

    const isMobile = screenWidth < 1024;
    const cardStyle = isMobile ? styles.productCardMobile : styles.productCard;
    const isFavorite = favorites.includes(item.id);

    return (
      <TouchableOpacity style={cardStyle} onPress={() => openProductDetail(item)}>
        <View style={styles.imageContainer}>
          <OptimizedImage
            source={{ uri: image }}
            style={styles.productImage}
            containerStyle={styles.imageContainer}
            resizeMode="contain"
            borderRadius={8}
            showShimmer={true}
            onLoad={() => console.log('Image loaded:', name)}
            onError={() => console.log('Image failed to load:', name)}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{name}</Text>
          <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (currentScreen === 'productDetail') {
    if (selectedProduct) {
      return (
        <SafeAreaProvider>
          <FavoritesProvider>
            <ProductDetailsScreenWeb
              productId={selectedProduct.id}
              onBack={goBackToHome}
            />
          </FavoritesProvider>
        </SafeAreaProvider>
      );
    } else if (loading) {
      // Show loading skeleton while trying to load product
      return (
        <SafeAreaProvider>
          <FavoritesProvider>
            <ProductDetailSkeleton showHeader={true} />
          </FavoritesProvider>
        </SafeAreaProvider>
      );
    } else if (error) {
      // Show error screen if product not found
      return (
        <SafeAreaProvider>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={goBackToHome}>
              <Text style={styles.retryButtonText}>Go Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaProvider>
      );
    }
  }

  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ElectronicEcomm</Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'products' && styles.activeTab]}
              onPress={() => setActiveTab('products')}
            >
              <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
                Products
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
                Favorites ({favorites.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {activeTab === 'products' && (
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={Colors.placeholder}
              />

              {loading && (
                <FlatList
                  data={Array(6).fill(null)}
                  renderItem={() => <ProductCardSkeleton isMobile={screenWidth < 1024} />}
                  keyExtractor={(_, index) => `skeleton-${index}`}
                  numColumns={screenWidth >= 1024 ? 2 : 1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.productsList}
                  columnWrapperStyle={screenWidth >= 1024 ? styles.row : null}
                  key={`skeleton-${screenWidth >= 1024 ? 'two-columns' : 'one-column'}`}
                />
              )}

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!loading && !error && (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item.id}
                  numColumns={screenWidth >= 1024 ? 2 : 1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.productsList}
                  columnWrapperStyle={screenWidth >= 1024 ? styles.row : null}
                  key={screenWidth >= 1024 ? 'two-columns' : 'one-column'}
                />
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>💔 No favorites yet</Text>
                  <Text style={styles.emptySubText}>
                    Tap the heart icon on products to add them to your favorites!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={products.filter(product => favorites.includes(product.id))}
                  renderItem={renderProduct}
                  keyExtractor={(item) => item.id}
                  numColumns={screenWidth >= 1024 ? 2 : 1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.productsList}
                  columnWrapperStyle={screenWidth >= 1024 ? styles.row : null}
                  key={`favorites-${screenWidth >= 1024 ? 'two-columns' : 'one-column'}`}
                />
              )}
            </>
          )}
        </View>
        </View>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.inactive,
    marginBottom: 40,
  },
  loading: {
    fontSize: 14,
    color: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.textLight,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.inactive,
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryDesc: {
    fontSize: 14,
    color: Colors.inactive,
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.inactive,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textLight,
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
  productCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    margin: 6,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '47%',
  },
  productCardMobile: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    margin: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.background,
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
  },
  productInfo: {
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'left',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.inactive,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
  },
  stock: {
    fontSize: 10,
    color: Colors.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: Colors.inactive,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default App;