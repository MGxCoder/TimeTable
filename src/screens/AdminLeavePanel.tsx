import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator"; // ✅ adjust the path if needed

type AdminLeavePanelNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdminLeavePanel"
>;

interface LeaveItem {
  id: string;
  name: string;
  role: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: string;
  appliedAt?: { seconds: number; nanoseconds: number };
}

const AdminLeavePanel: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AdminLeavePanelNavigationProp>(); // ✅ initialize navigation

  useEffect(() => {
    // Real-time listener for Firestore
    const unsubscribe = firestore()
      .collection("leaves")
      .orderBy("appliedAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LeaveItem[];
        setLeaves(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // 🗑️ Delete leave handler
  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this leave request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection("leaves").doc(id).delete();
              Alert.alert("Deleted", "Leave request has been deleted.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete the leave request.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text style={styles.loadingText}>Loading leave requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗂️ All Leave Requests</Text>

      {/* ✅ Back to Home button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={styles.buttonText}>⬅️ Back to Home</Text>
      </TouchableOpacity>

      {leaves.length === 0 ? (
        <Text style={styles.noData}>No leave requests yet.</Text>
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>
                <Text style={styles.label}>Name: </Text>
                {item.name}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Role: </Text>
                {item.role}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Reason: </Text>
                {item.reason}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>From: </Text>
                {new Date(item.fromDate).toDateString()}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>To: </Text>
                {new Date(item.toDate).toDateString()}
              </Text>
              <Text
                style={[
                  styles.text,
                  { color: item.status === "Pending" ? "#f1c40f" : "#2ecc71" },
                ]}
              >
                <Text style={styles.label}>Status: </Text>
                {item.status}
              </Text>

              {/* 🗑️ Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AdminLeavePanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
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
  card: {
    backgroundColor: "#1B1B2F",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    color: "#A259FF",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F1A",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  noData: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});
