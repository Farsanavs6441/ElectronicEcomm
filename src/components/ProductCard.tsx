import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import ProgressiveImage from './ProgressiveImage';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavoritePress?: (productId: string) => void;
  isFavorite?: boolean;
  showFavoriteIcon?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (productId: string) => void;
  testID?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteIcon = false,
  onRemove,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      testID={testID ? `${testID}-button` : undefined}
    >
      <View style={styles.imageContainer}>
        <ProgressiveImage
          source={{ uri: product.image }}
          style={styles.productImage}
          containerStyle={styles.imageContainer}
          resizeMode='cover'
          borderRadius={8}
          onLoad={() => {}}
          onError={() => {}}
          priority='normal'
        /> 
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 6,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '98%',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
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
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
   // marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    //marginBottom: 8,
  },
});

export default ProductCard;
