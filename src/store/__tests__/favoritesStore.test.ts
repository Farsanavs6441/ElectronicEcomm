import {
  favoritesReducer,
  initialState,
  FavoritesState,
} from '../favoritesReducer';
import {
  favoritesActionCreators,
  FAVORITES_ACTIONS,
} from '../favoritesActions';

describe('Favorites Store', () => {
  describe('Action Creators', () => {
    it('creates setFavorites action', () => {
      const favorites = ['1', '2', '3'];
      const action = favoritesActionCreators.setFavorites(favorites);

      expect(action).toEqual({
        type: FAVORITES_ACTIONS.SET_FAVORITES,
        payload: favorites,
      });
    });

    it('creates addFavorite action', () => {
      const action = favoritesActionCreators.addFavorite('123');

      expect(action).toEqual({
        type: FAVORITES_ACTIONS.ADD_FAVORITE,
        payload: '123',
      });
    });

    it('creates removeFavorite action', () => {
      const action = favoritesActionCreators.removeFavorite('123');

      expect(action).toEqual({
        type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
        payload: '123',
      });
    });

    it('creates toggleFavorite action', () => {
      const action = favoritesActionCreators.toggleFavorite('123');

      expect(action).toEqual({
        type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
        payload: '123',
      });
    });

    it('creates clearFavorites action', () => {
      const action = favoritesActionCreators.clearFavorites();

      expect(action).toEqual({
        type: FAVORITES_ACTIONS.CLEAR_FAVORITES,
      });
    });
  });

  describe('Reducer', () => {
    it('returns initial state', () => {
      const state = favoritesReducer(initialState, { type: 'UNKNOWN' } as any);
      expect(state).toEqual(initialState);
    });

    it('handles SET_FAVORITES', () => {
      const favorites = ['1', '2', '3'];
      const action = favoritesActionCreators.setFavorites(favorites);
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        favorites: ['1', '2', '3'],
      });
    });

    it('handles ADD_FAVORITE', () => {
      const action = favoritesActionCreators.addFavorite('123');
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        favorites: ['123'],
      });
    });

    it('handles ADD_FAVORITE - prevents duplicates', () => {
      const currentState: FavoritesState = { favorites: ['123'] };
      const action = favoritesActionCreators.addFavorite('123');
      const state = favoritesReducer(currentState, action);

      expect(state).toEqual({
        favorites: ['123'],
      });
      expect(state.favorites).toHaveLength(1);
    });

    it('handles REMOVE_FAVORITE', () => {
      const currentState: FavoritesState = { favorites: ['123', '456'] };
      const action = favoritesActionCreators.removeFavorite('123');
      const state = favoritesReducer(currentState, action);

      expect(state).toEqual({
        favorites: ['456'],
      });
    });

    it('handles REMOVE_FAVORITE - item not in list', () => {
      const currentState: FavoritesState = { favorites: ['123'] };
      const action = favoritesActionCreators.removeFavorite('999');
      const state = favoritesReducer(currentState, action);

      expect(state).toEqual({
        favorites: ['123'],
      });
    });

    it('handles TOGGLE_FAVORITE - adds when not present', () => {
      const action = favoritesActionCreators.toggleFavorite('123');
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        favorites: ['123'],
      });
    });

    it('handles TOGGLE_FAVORITE - removes when present', () => {
      const currentState: FavoritesState = { favorites: ['123', '456'] };
      const action = favoritesActionCreators.toggleFavorite('123');
      const state = favoritesReducer(currentState, action);

      expect(state).toEqual({
        favorites: ['456'],
      });
    });

    it('handles CLEAR_FAVORITES', () => {
      const currentState: FavoritesState = { favorites: ['123', '456'] };
      const action = favoritesActionCreators.clearFavorites();
      const state = favoritesReducer(currentState, action);

      expect(state).toEqual({
        favorites: [],
      });
    });

    it('maintains immutability', () => {
      const currentState: FavoritesState = { favorites: ['123'] };
      const action = favoritesActionCreators.addFavorite('456');
      const newState = favoritesReducer(currentState, action);

      expect(newState).not.toBe(currentState);
      expect(newState.favorites).not.toBe(currentState.favorites);
      expect(currentState.favorites).toEqual(['123']);
      expect(newState.favorites).toEqual(['123', '456']);
    });
  });

  describe('Action Constants', () => {
    it('has correct action types', () => {
      expect(FAVORITES_ACTIONS.SET_FAVORITES).toBe('SET_FAVORITES');
      expect(FAVORITES_ACTIONS.ADD_FAVORITE).toBe('ADD_FAVORITE');
      expect(FAVORITES_ACTIONS.REMOVE_FAVORITE).toBe('REMOVE_FAVORITE');
      expect(FAVORITES_ACTIONS.TOGGLE_FAVORITE).toBe('TOGGLE_FAVORITE');
      expect(FAVORITES_ACTIONS.CLEAR_FAVORITES).toBe('CLEAR_FAVORITES');
    });
  });
});
