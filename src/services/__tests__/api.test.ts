import { ApiService } from '../api';
import { Product } from '../../types';

// Mock fetch globally
global.fetch = jest.fn();

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 99.99,
    category: 'Electronics',
    image: 'https://example.com/image1.jpg',
    description: 'Test description 1',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    category: 'Electronics',
    image: 'https://example.com/image2.jpg',
    description: 'Test description 2',
    rating: 4.0,
    inStock: false,
  },
];

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('successfully fetches products', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const products = await ApiService.fetchProducts();

      expect(fetch).toHaveBeenCalledWith(
        'https://mocki.io/v1/c53fb45e-5085-487a-afac-0295f62fb86e',
      );
      expect(products).toEqual(mockProducts);
    });

    it('throws an error when API request fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(ApiService.fetchProducts()).rejects.toThrow(
        'HTTP error! status: 500',
      );
    });

    it('throws an error when network request fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(ApiService.fetchProducts()).rejects.toThrow('Network error');
    });
  });

  describe('fetchProductById', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      });
    });

    it('successfully fetches a product by ID', async () => {
      const product = await ApiService.fetchProductById('1');

      expect(product).toEqual(mockProducts[0]);
    });

    it('returns null when product ID is not found', async () => {
      const product = await ApiService.fetchProductById('999');

      expect(product).toBeNull();
    });

    it('throws an error when fetchProducts fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(ApiService.fetchProductById('1')).rejects.toThrow(
        'HTTP error! status: 500',
      );
    });
  });
});
