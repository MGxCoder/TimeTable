import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AddSubjectScreen() {
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [type, setType] = useState('Lecture');
  const [hoursPerWeek, setHoursPerWeek] = useState('3');

  const addSubject = async () => {
    if (!name || !teacher || !type) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    await firestore().collection('subjects').add({
      name,
      teacher,
      type,
      hoursPerWeek: parseInt(hoursPerWeek),
    });
    Alert.alert('Success', 'Subject added successfully!');
    setName('');
    setTeacher('');
    setType('Lecture');
    setHoursPerWeek('3');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Subject</Text>
      <TextInput placeholder="Subject Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Teacher Name" style={styles.input} value={teacher} onChangeText={setTeacher} />
      <TextInput placeholder="Type (Lecture/Lab/Project)" style={styles.input} value={type} onChangeText={setType} />
      <TextInput placeholder="Hours per week" style={styles.input} value={hoursPerWeek} onChangeText={setHoursPerWeek} keyboardType="numeric" />

      <TouchableOpacity onPress={addSubject} style={styles.button}>
        <Text style={styles.buttonText}>Add Subject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', padding: 20 },
  header: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1C1C2A', color: 'white', padding: 12, borderRadius: 10, marginVertical: 8 },
  button: { backgroundColor: '#A259FF', padding: 15, borderRadius: 12, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
