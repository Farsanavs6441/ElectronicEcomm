import { StyleSheet } from 'react-native';
import Colors from '../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 100,
  },

  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.inactive,
    marginBottom: 40,
  },

  loaderContainer: {
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: Colors.inactive,
    textAlign: 'center',
  },
});