// src/screens/ApplyLeaveScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import firestore, { firebase } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type ApplyLeaveScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ApplyLeave"
>;

const ApplyLeaveScreen: React.FC = () => {
  const navigation = useNavigation<ApplyLeaveScreenNavigationProp>();
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

  // 🔹 Fetch user data (name, role) from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get();
        if (userDoc.exists()) {
          setUserData(userDoc.data() as { name: string; role: string });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleApplyLeave = async () => {
    if (!reason.trim()) {
      Alert.alert("Missing Info", "Please enter a reason for your leave.");
      return;
    }

    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      await firestore().collection("leaves").add({
        userId: user.uid,
        name: userData?.name || "Unknown",
        role: userData?.role || "User",
        reason,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        status: "Pending",
        appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Success", "Your leave request has been submitted!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  };

  const onFromChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowFromPicker(false);
    if (selected) setFromDate(selected);
  };

  const onToChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowToPicker(false);
    if (selected) setToDate(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Apply for Leave</Text>

      <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>From: {fromDate.toDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>To: {toDate.toDateString()}</Text>
      </TouchableOpacity>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onFromChange}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onToChange}
        />
      )}

      <TextInput
        placeholder="Reason for leave"
        placeholderTextColor="#ccc"
        value={reason}
        onChangeText={setReason}
        multiline
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleApplyLeave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit Leave"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>⬅️ Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApplyLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
    padding: 25,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  dateButton: {
    backgroundColor: "#A259FF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  dateText: { color: "#fff", fontSize: 16 },
  input: {
    backgroundColor: "#1B1B2F",
    color: "white",
    fontSize: 16,
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#A259FF",
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  backButton: { backgroundColor: "#E74C3C" },
});
