import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";  

type Slot = {
  id?: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
};
type AdminLeavePanelNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdminLeavePanel"
>;
const ViewTimetableScreen: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [year, setYear] = useState("2025");
  const [className, setClassName] = useState("BE-B");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<AdminLeavePanelNavigationProp>();

  // 🔹 Fetch Timetable Data
  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const docRef = firestore().collection("timetable").doc(`${year}_${className}`);
      const doc = await docRef.get();

      if (doc.exists()) {
        const data = doc.data();
        setSlots((data?.slots as Slot[]) || []);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📚 View Timetable</Text>
      <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("HomeScreen")}
            >
              <Text style={styles.buttonText}>⬅️ Back to Home</Text>
            </TouchableOpacity>

      {/* Year and Class Inputs */}
      <TextInput
        placeholder="Enter Year (e.g., 2025)"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        placeholder="Enter Class (e.g., BE-B)"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={className}
        onChangeText={setClassName}
      />

      <CustomButton title="Load Timetable" onPress={fetchTimetable} />

      {loading ? (
        <ActivityIndicator size="large" color="#A259FF" style={{ marginTop: 20 }} />
      ) : slots.length === 0 ? (
        <Text style={styles.noData}>No timetable found for {year} - {className}</Text>
      ) : (
        <FlatList
          data={slots.sort((a, b) => a.day.localeCompare(b.day))}
          keyExtractor={(item) => item.id || `${item.day}_${item.time}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.day}>{item.day}</Text>
              <Text style={styles.detail}>🕒 {item.time}</Text>
              <Text style={styles.detail}>📘 {item.subject}</Text>
              <Text style={styles.detail}>👩‍🏫 {item.teacher}</Text>
              <Text style={styles.detail}>🏫 {item.room}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

export default ViewTimetableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0129", padding: 20 },
  title: {
    fontSize: 24,
    color: "#A259FF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1c0845",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#1c0845",
    borderRadius: 12,
    padding: 15,
    marginVertical: 6,
  },
  day: {
    color: "#A259FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: { color: "white", fontSize: 16 },
  noData: {
    color: "gray",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#A259FF",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
