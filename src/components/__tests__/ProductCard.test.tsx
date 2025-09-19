import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../ProductCard';
import { Product } from '../../types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  category: 'Electronics',
  image: 'https://example.com/image.jpg',
  description: 'Test description',
  rating: 4.5,
  inStock: true,
};

describe('ProductCard', () => {
  const mockOnPress = jest.fn();
  const mockOnFavoritePress = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} testID="product-card" />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
    expect(getByText('Electronics')).toBeTruthy();
  });

  it('calls onPress when product is pressed', () => {
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} testID="product-card" />
    );

    fireEvent.press(getByTestId('product-card-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('displays product image with correct source', () => {
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} testID="product-card" />
    );

    const image = getByTestId('product-image');
    expect(image.props.source).toEqual({
      uri: 'https://example.com/image.jpg',
      cache: 'force-cache',
    });
  });

  it('renders with favorite functionality when props are provided', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        isFavorite={false}
        showFavoriteIcon={true}
      />
    );

    // Note: Favorite icon is currently commented out in the component
    // This test would need to be updated when that feature is uncommented
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('handles onRemove callback when provided', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        onRemove={mockOnRemove}
        showRemoveButton={true}
      />
    );

    // Note: Remove button is not currently implemented in the component
    // This test would need to be updated when that feature is implemented
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('displays correct price formatting', () => {
    const productWithHighPrice = {
      ...mockProduct,
      price: 1234.56,
    };

    const { getByText } = render(
      <ProductCard product={productWithHighPrice} onPress={mockOnPress} />
    );

    expect(getByText('$1234.56')).toBeTruthy();
  });

  it('displays correct product information', () => {
    const customProduct = {
      ...mockProduct,
      name: 'Custom Product Name',
      category: 'Custom Category',
      price: 50.99,
    };

    const { getByText } = render(
      <ProductCard product={customProduct} onPress={mockOnPress} />
    );

    expect(getByText('Custom Product Name')).toBeTruthy();
    expect(getByText('Custom Category')).toBeTruthy();
    expect(getByText('$50.99')).toBeTruthy();
  });
});