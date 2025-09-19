import { StyleSheet } from 'react-native';

export const combineStyles = (...styleSets: any[]) => {
  return StyleSheet.create(Object.assign({}, ...styleSets));
};