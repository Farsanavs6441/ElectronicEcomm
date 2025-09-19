export const FAVORITES_ACTIONS = {
  SET_FAVORITES: 'SET_FAVORITES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
} as const;

export type FavoritesAction =
  | { type: typeof FAVORITES_ACTIONS.SET_FAVORITES; payload: string[] }
  | { type: typeof FAVORITES_ACTIONS.ADD_FAVORITE; payload: string }
  | { type: typeof FAVORITES_ACTIONS.REMOVE_FAVORITE; payload: string }
  | { type: typeof FAVORITES_ACTIONS.TOGGLE_FAVORITE; payload: string }
  | { type: typeof FAVORITES_ACTIONS.CLEAR_FAVORITES };

export const favoritesActionCreators = {
  setFavorites: (favorites: string[]): FavoritesAction => ({
    type: FAVORITES_ACTIONS.SET_FAVORITES,
    payload: favorites,
  }),

  addFavorite: (id: string): FavoritesAction => ({
    type: FAVORITES_ACTIONS.ADD_FAVORITE,
    payload: id,
  }),

  removeFavorite: (id: string): FavoritesAction => ({
    type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
    payload: id,
  }),

  toggleFavorite: (id: string): FavoritesAction => ({
    type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
    payload: id,
  }),

  clearFavorites: (): FavoritesAction => ({
    type: FAVORITES_ACTIONS.CLEAR_FAVORITES,
  }),
};