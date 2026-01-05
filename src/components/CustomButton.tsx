import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const theme = {
  colors: {
    neon: '#A259FF',
    white: '#FFFFFF',
  },
};

const CustomButton = ({ title, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.neon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: theme.colors.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  text: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
