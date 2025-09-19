import { Product } from '../types';

const API_URL = 'https://mocki.io/v1/c53fb45e-5085-487a-afac-0295f62fb86e';

export class ApiService {
  static async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Ensure all products have required properties with defaults
      return data.map((product: any) => ({
        ...product,
        inStock: product.inStock !== undefined ? product.inStock : true, // Default to true if not specified
        rating: product.rating || 4.5, // Default rating if not specified
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async fetchProductById(id: string): Promise<Product | null> {
    try {
      const products = await this.fetchProducts();
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }
}

export default ApiService;
