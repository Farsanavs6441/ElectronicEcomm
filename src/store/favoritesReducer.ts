import { FAVORITES_ACTIONS, FavoritesAction } from './favoritesActions';

export interface FavoritesState {
  favorites: string[];
}

export const initialState: FavoritesState = {
  favorites: [],
};

export const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  switch (action.type) {
    case FAVORITES_ACTIONS.SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };

    case FAVORITES_ACTIONS.ADD_FAVORITE:
      if (state.favorites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case FAVORITES_ACTIONS.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };

    case FAVORITES_ACTIONS.TOGGLE_FAVORITE:
      const isCurrentlyFavorite = state.favorites.includes(action.payload);
      if (isCurrentlyFavorite) {
        return {
          ...state,
          favorites: state.favorites.filter(id => id !== action.payload),
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }

    case FAVORITES_ACTIONS.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: [],
      };

    default:
      return state;
  }
};