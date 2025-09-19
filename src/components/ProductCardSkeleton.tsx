import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';

interface ProductCardSkeletonProps {
  isMobile?: boolean;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  isMobile = false,
}) => {
  const cardStyle = isMobile ? styles.productCardMobile : styles.productCard;

  return (
    <View style={cardStyle}>
      {/* Image shimmer */}
      <ShimmerPlaceholder
        width='100%'
        height={160}
        borderRadius={8}
        style={styles.imageShimmer}
      />

      {/* Product info shimmer */}
      <View style={styles.productInfo}>
        {/* Product name shimmer */}
        <ShimmerPlaceholder
          width='80%'
          height={16}
          borderRadius={4}
          style={styles.nameShimmer}
        />

        {/* Product price shimmer */}
        <ShimmerPlaceholder
          width='40%'
          height={18}
          borderRadius={4}
          style={styles.priceShimmer}
        />
      </View>
    </View>
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
    width: '47%',
  },
  productCardMobile: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  imageShimmer: {
    marginBottom: 12,
  },
  productInfo: {
    alignItems: 'flex-start',
  },
  nameShimmer: {
    marginBottom: 8,
  },
  priceShimmer: {
    marginBottom: 4,
  },
});

export default ProductCardSkeleton;
