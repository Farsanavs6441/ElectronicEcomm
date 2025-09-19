import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Only specific styles for ProductDetailsScreen
  // Common styles like container, loadingContainer, etc. will be imported from commonStyles

  productImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },

  content: {
    padding: 20,
  },

  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },

  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },

  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
  },

  buttonContainer: {
    gap: 12,
  },

  addToCartButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  favoriteIcon: {
    fontSize: 24,
  },
});
