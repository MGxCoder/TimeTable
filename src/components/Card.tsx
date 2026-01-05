import React from 'react';
import { View, StyleSheet } from 'react-native';

const theme = {
  colors: {
    glass: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
  neon: '#A259FF',
};

const Card = ({ children, style }: any) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.glass,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: 10,
    padding: 18,
    shadowColor: theme.neon,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
});

export default Card;
