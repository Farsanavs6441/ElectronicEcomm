import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';

interface ProductDetailSkeletonProps {
  showHeader?: boolean;
}

const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({
  showHeader = true,
}) => {
  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <ShimmerPlaceholder width={80} height={40} borderRadius={8} />
          <ShimmerPlaceholder width='60%' height={20} borderRadius={4} />
          <View style={styles.headerSpacer} />
        </View>
      )}

      <ScrollView style={styles.scrollContainer}>
        {/* Product Image Shimmer */}
        <ShimmerPlaceholder
          width='100%'
          height={400}
          borderRadius={0}
          style={styles.imageShimmer}
        />

        <View style={styles.content}>
          {/* Product Header */}
          <View style={styles.headerRow}>
            <ShimmerPlaceholder width='70%' height={24} borderRadius={4} />
            <ShimmerPlaceholder width={24} height={24} borderRadius={12} />
          </View>

          {/* Price */}
          <ShimmerPlaceholder
            width='30%'
            height={28}
            borderRadius={4}
            style={styles.priceShimmer}
          />

          {/* Category */}
          <ShimmerPlaceholder
            width='40%'
            height={16}
            borderRadius={4}
            style={styles.categoryShimmer}
          />

          {/* Rating and Stock */}
          <View style={styles.ratingContainer}>
            <ShimmerPlaceholder width='25%' height={16} borderRadius={4} />
            <ShimmerPlaceholder width='20%' height={14} borderRadius={4} />
          </View>

          {/* Description Title */}
          <ShimmerPlaceholder
            width='35%'
            height={18}
            borderRadius={4}
            style={styles.descriptionTitleShimmer}
          />

          {/* Description Lines */}
          <ShimmerPlaceholder
            width='100%'
            height={16}
            borderRadius={4}
            style={styles.descriptionLineShimmer}
          />
          <ShimmerPlaceholder
            width='85%'
            height={16}
            borderRadius={4}
            style={styles.descriptionLineShimmer}
          />
          <ShimmerPlaceholder
            width='60%'
            height={16}
            borderRadius={4}
            style={styles.descriptionLineShimmer}
          />

          {/* Button */}
          <ShimmerPlaceholder
            width='100%'
            height={60}
            borderRadius={8}
            style={styles.buttonShimmer}
          />
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
    backgroundColor: '#f8f8f8',
  },
  headerSpacer: {
    width: 80,
  },
  scrollContainer: {
    flex: 1,
  },
  imageShimmer: {
    backgroundColor: '#f0f0f0',
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
  priceShimmer: {
    marginBottom: 8,
  },
  categoryShimmer: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  descriptionTitleShimmer: {
    marginBottom: 8,
  },
  descriptionLineShimmer: {
    marginBottom: 6,
  },
  buttonShimmer: {
    marginTop: 20,
  },
});

export default ProductDetailSkeleton;
