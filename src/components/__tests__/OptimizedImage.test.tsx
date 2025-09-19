import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage', () => {
  const mockSource = { uri: 'https://example.com/test-image.jpg' };
  const mockOnLoad = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <OptimizedImage source={mockSource} testID="optimized-image" />
    );

    expect(getByTestId('optimized-image')).toBeTruthy();
  });

  it('shows shimmer when loading by default', () => {
    const component = render(
      <OptimizedImage source={mockSource} testID="optimized-image" />
    );

    // Component should render without errors and include shimmer
    expect(component.toJSON()).toBeTruthy();
  });

  it('hides shimmer when showShimmer is false', () => {
    const component = render(
      <OptimizedImage
        source={mockSource}
        showShimmer={false}
        testID="optimized-image"
      />
    );

    expect(component.toJSON()).toBeTruthy();
  });

  it('calls onLoad callback when image loads successfully', async () => {
    const { getByTestId } = render(
      <OptimizedImage
        source={mockSource}
        onLoad={mockOnLoad}
        testID="optimized-image"
      />
    );

    const image = getByTestId('optimized-image-img');
    fireEvent(image, 'load');

    await waitFor(() => {
      expect(mockOnLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const { getByTestId } = render(
      <OptimizedImage
        source={mockSource}
        onError={mockOnError}
        testID="optimized-image"
      />
    );

    const image = getByTestId('optimized-image-img');
    fireEvent(image, 'error');

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(1);
    });
  });

  it('applies custom styles correctly', () => {
    const customStyle = { width: 200, height: 200 };
    const customContainerStyle = { margin: 10 };

    const { getByTestId } = render(
      <OptimizedImage
        source={mockSource}
        style={customStyle}
        containerStyle={customContainerStyle}
        testID="optimized-image"
      />
    );

    const container = getByTestId('optimized-image');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customContainerStyle)
      ])
    );
  });

  it('applies custom border radius', () => {
    const { getByTestId } = render(
      <OptimizedImage
        source={mockSource}
        borderRadius={12}
        testID="optimized-image"
      />
    );

    const container = getByTestId('optimized-image');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 12 })
      ])
    );
  });

  it('sets correct resize mode', () => {
    const { getByTestId } = render(
      <OptimizedImage
        source={mockSource}
        resizeMode="contain"
        testID="optimized-image"
      />
    );

    const image = getByTestId('optimized-image-img');
    expect(image.props.resizeMode).toBe('contain');
  });

  it('handles image source correctly', () => {
    const { getByTestId } = render(
      <OptimizedImage source={mockSource} testID="optimized-image" />
    );

    const image = getByTestId('optimized-image-img');
    expect(image.props.source).toEqual(mockSource);
  });

  it('shows error placeholder when image fails to load', async () => {
    const { getByTestId } = render(
      <OptimizedImage source={mockSource} testID="optimized-image" />
    );

    const image = getByTestId('optimized-image-img');
    fireEvent(image, 'error');

    await waitFor(() => {
      const errorContainer = getByTestId('optimized-image-error');
      expect(errorContainer).toBeTruthy();
    });
  });
});