import React from 'react';
import { render } from '@testing-library/react-native';
import ShimmerPlaceholder from '../ShimmerPlaceholder';

describe('ShimmerPlaceholder', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ShimmerPlaceholder testID='shimmer' />);
    expect(getByTestId('shimmer')).toBeTruthy();
  });

  it('applies custom width and height', () => {
    const { getByTestId } = render(
      <ShimmerPlaceholder testID='shimmer' width={200} height={100} />,
    );
    const shimmer = getByTestId('shimmer');
    expect(shimmer.props.style).toEqual(
      expect.objectContaining({
        width: 200,
        height: 100,
      }),
    );
  });

  it('applies custom border radius', () => {
    const { getByTestId } = render(
      <ShimmerPlaceholder testID='shimmer' borderRadius={10} />,
    );
    const shimmer = getByTestId('shimmer');
    expect(shimmer.props.style).toEqual(
      expect.objectContaining({
        borderRadius: 10,
      }),
    );
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <ShimmerPlaceholder testID='shimmer' style={customStyle} />,
    );
    const shimmer = getByTestId('shimmer');
    expect(shimmer.props.style).toEqual(expect.objectContaining(customStyle));
  });

  it('renders with percentage width', () => {
    const { getByTestId } = render(
      <ShimmerPlaceholder testID='shimmer' width='80%' />,
    );
    const shimmer = getByTestId('shimmer');
    expect(shimmer.props.style).toEqual(
      expect.objectContaining({
        width: '80%',
      }),
    );
  });
});
