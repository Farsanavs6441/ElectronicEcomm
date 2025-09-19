import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Screen-specific styles only
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '98%',
  },

  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },

  productInfo: {
    alignItems: 'flex-start',
  },

  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'left',
  },

  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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

  favouritesButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },

  favouritesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  productsList: {
    paddingBottom: 20,
  },

  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },

  imageContainer: {
    position: 'relative',
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
    textAlign: 'center',
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  cartButton: {
    position: 'relative',
    padding: 8,
  },

  cartIcon: {
    fontSize: 24,
    color: '#007AFF',
  },

  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});