import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product, RootStackParamList } from '../types';

type FavouritesNavigationProp = StackNavigationProp<RootStackParamList, 'Favourites'>;

const FavouritesScreen: React.FC = () => {
  const navigation = useNavigation<FavouritesNavigationProp>();
  const [favourites, setFavourites] = useState<Product[]>([]);

  useEffect(() => {
    // Mock favourite products - replace with actual storage/API call
    const mockFavourites: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        price: 999,
        description: 'Latest iPhone with advanced features',
        image: 'https://via.placeholder.com/150',
        category: 'Smartphones',
        rating: 4.8,
        inStock: true,
      },
      {
        id: '3',
        name: 'MacBook Pro 16"',
        price: 2399,
        description: 'Professional laptop for power users',
        image: 'https://via.placeholder.com/150',
        category: 'Laptops',
        rating: 4.9,
        inStock: false,
      },
    ];
    setFavourites(mockFavourites);
  }, []);

  const removeFavourite = (productId: string) => {
    Alert.alert(
      'Remove Favourite',
      'Are you sure you want to remove this item from favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavourites(prev => prev.filter(item => item.id !== productId));
          },
        },
      ]
    );
  };

  const renderFavouriteItem = ({ item }: { item: Product }) => (
    <View style={styles.favouriteCard}>
      <TouchableOpacity
        style={styles.productInfo}
        onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={[styles.stockStatus, { color: item.inStock ? 'green' : 'red' }]}>
            {item.inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavourite(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
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
  favouriteCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
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
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default FavouritesScreen;