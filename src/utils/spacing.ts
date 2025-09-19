// Spacing constants for consistent layout
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Helper function to get spacing values
export const getSpacing = (size: keyof typeof spacing): number => spacing[size];

export default spacing;