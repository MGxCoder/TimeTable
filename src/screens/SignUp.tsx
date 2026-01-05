import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Input from '../components/Input';
import CustomButton from '../components/CustomButton';

const SignUp = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Admin', 'Teacher', 'Student'];

  const onRegister = async () => {
    if (!email || !password || !name || !surname || !role) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await firestore().collection('users').doc(userId).set({
        name,
        surname,
        role,
        email,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login')
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Input placeholder="First Name" value={name} onChangeText={setName} />
      <Input placeholder="Last Name" value={surname} onChangeText={setSurname} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRole(r)}
            style={[styles.roleBox, role === r && styles.roleSelected]}
          >
            <Text style={styles.roleText}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomButton title={loading ? 'Creating Account...' : 'Sign Up'} onPress={onRegister} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  roleBox: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleSelected: {
    borderColor: '#A259FF',
    backgroundColor: 'rgba(162,89,255,0.2)',
  },
  roleText: {
    color: 'white',
    fontSize: 16,
  },
});
