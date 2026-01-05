import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const theme = {
  colors: {
    glass: 'rgba(255, 255, 255)',
    text: '#000000ff',
  },
  neon: '#A259FF',
};

const Input = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.6)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.glass,
    // borderColor: theme.colors.border,
    borderWidth: 1,
    paddingHorizontal: 15,
    // shadowColor: theme.neon,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.8,
    // shadowRadius: 8,
    elevation: 12,
  },
  input: {
    height: 50,
    color: theme.colors.text,
    fontSize: 16,
  },
});

export default Input;
