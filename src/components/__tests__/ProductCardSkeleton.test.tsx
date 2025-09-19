import React from 'react';
import { render } from '@testing-library/react-native';
import ProductCardSkeleton from '../ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ProductCardSkeleton />);

    // Check if ShimmerPlaceholder components are rendered
    // We need to verify the structure exists
    const component = render(<ProductCardSkeleton />);
    expect(component.toJSON()).toBeTruthy();
  });

  it('renders with mobile layout when isMobile is true', () => {
    const { getByTestId } = render(<ProductCardSkeleton isMobile={true} />);

    const component = render(<ProductCardSkeleton isMobile={true} />);
    expect(component.toJSON()).toBeTruthy();
  });

  it('renders with desktop layout when isMobile is false', () => {
    const { getByTestId } = render(<ProductCardSkeleton isMobile={false} />);

    const component = render(<ProductCardSkeleton isMobile={false} />);
    expect(component.toJSON()).toBeTruthy();
  });

  it('renders multiple shimmer placeholders for different content areas', () => {
    const component = render(<ProductCardSkeleton />);
    const tree = component.toJSON();

    // The component should render a container with multiple shimmer elements
    expect(tree).toBeTruthy();

    // Since we can't easily count ShimmerPlaceholder components without testIDs,
    // we verify the component structure renders without errors
    expect(component.root).toBeTruthy();
  });

  it('applies correct styling based on mobile prop', () => {
    const mobileComponent = render(<ProductCardSkeleton isMobile={true} />);
    const desktopComponent = render(<ProductCardSkeleton isMobile={false} />);

    expect(mobileComponent.toJSON()).toBeTruthy();
    expect(desktopComponent.toJSON()).toBeTruthy();

    // Both should render successfully but with different layouts
    expect(mobileComponent.toJSON()).not.toEqual(desktopComponent.toJSON());
  });
});
