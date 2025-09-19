export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favourites: string[];
}

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  ProductList: undefined;
  ProductDetails: { productId: string };
  Favourites: undefined;
};