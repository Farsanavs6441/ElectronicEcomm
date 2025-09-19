import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesProvider, useFavorites } from '../FavoritesContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Test component that uses the FavoritesContext
const TestComponent: React.FC = () => {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    loadFavorites
  } = useFavorites();

  return (
    <>
      <Text testID="favorites-count">{favorites.length}</Text>
      <Text testID="favorites-list">{favorites.join(',')}</Text>
      <Text testID="is-favorite-1">{isFavorite('1').toString()}</Text>
      <TouchableOpacity testID="add-favorite-1" onPress={() => addFavorite('1')}>
        <Text>Add 1</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="remove-favorite-1" onPress={() => removeFavorite('1')}>
        <Text>Remove 1</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="toggle-favorite-2" onPress={() => toggleFavorite('2')}>
        <Text>Toggle 2</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="load-favorites" onPress={() => loadFavorites()}>
        <Text>Load</Text>
      </TouchableOpacity>
    </>
  );
};

const renderWithProvider = () => {
  return render(
    <FavoritesProvider>
      <TestComponent />
    </FavoritesProvider>
  );
};

describe('FavoritesContext', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  it('throws error when useFavorites is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFavorites must be used within a FavoritesProvider');

    consoleError.mockRestore();
  });

  it('initializes with empty favorites list', async () => {
    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
      expect(getByTestId('favorites-list')).toHaveTextContent('');
      expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    });
  });

  it('loads favorites from AsyncStorage on mount', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(['1', '2', '3']));

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('3');
      expect(getByTestId('favorites-list')).toHaveTextContent('1,2,3');
      expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    });

    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('electronicEcomm_favorites');
  });

  it('adds a favorite successfully', async () => {
    const { getByTestId } = renderWithProvider();

    fireEvent.press(getByTestId('add-favorite-1'));

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
      expect(getByTestId('favorites-list')).toHaveTextContent('1');
      expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    });

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'electronicEcomm_favorites',
      JSON.stringify(['1'])
    );
  });

  it('does not add duplicate favorites', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(['1']));

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
    });

    fireEvent.press(getByTestId('add-favorite-1'));

    // Should still be 1, not 2
    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
    });
  });

  it('removes a favorite successfully', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(['1', '2']));

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('2');
    });

    fireEvent.press(getByTestId('remove-favorite-1'));

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
      expect(getByTestId('favorites-list')).toHaveTextContent('2');
      expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    });

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'electronicEcomm_favorites',
      JSON.stringify(['2'])
    );
  });

  it('toggles favorite correctly - adds when not present', async () => {
    const { getByTestId } = renderWithProvider();

    fireEvent.press(getByTestId('toggle-favorite-2'));

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
      expect(getByTestId('favorites-list')).toHaveTextContent('2');
    });
  });

  it('toggles favorite correctly - removes when present', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(['2']));

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
    });

    fireEvent.press(getByTestId('toggle-favorite-2'));

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
      expect(getByTestId('favorites-list')).toHaveTextContent('');
    });
  });

  it('handles AsyncStorage errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

    const { getByTestId } = renderWithProvider();

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error loading favorites:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('handles save errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('Save error'));

    const { getByTestId } = renderWithProvider();

    fireEvent.press(getByTestId('add-favorite-1'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error saving favorites:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});