import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from './src/utils/colors';
import ApiService from './src/services/api';
import { Product } from './src/types';

function App(): React.JSX.Element {
  console.log('App rendering...');

  const [showSplash, setShowSplash] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      loadProducts();
    }, 2000);
    return () => clearTimeout(timer);
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
    const rating = typeof item.rating === 'number' ? item.rating : 0;
    const name = item.name || 'Unknown Product';
    const category = item.category || 'General';
    const image = item.image || '';
    const inStock = item.inStock !== undefined ? item.inStock : true;

    return (
      <TouchableOpacity style={styles.productCard}>
        <Image
          source={{ uri: image }}
          style={styles.productImage}
          defaultSource={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=' }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{name}</Text>
          <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
          <Text style={styles.productCategory}>{category}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
            <Text style={[styles.stock, { color: inStock ? Colors.success : Colors.error }]}>
              {inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Products</Text>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={Colors.placeholder}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
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
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          )}
        </View>
      </View>
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
  productCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: '45%',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
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
});

export default App;