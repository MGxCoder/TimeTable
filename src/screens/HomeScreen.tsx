import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";

// 🔹 Define navigation type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

interface UserData {
  name: string;
  role: "Admin" | "Teacher" | "Student";
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection("users")
            .doc(user.uid)
            .get();

          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            console.warn("No user document found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A259FF" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>User data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userData.name} 👋</Text>
      <Text style={styles.role}>Role: {userData.role}</Text>

      {/* Common option for all */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ViewTimetable")}
      >
        <Text style={styles.buttonText}>📅 View Timetable</Text>
      </TouchableOpacity>

      {/* Teacher & Student */}
      {(userData.role === "Teacher" || userData.role === "Student") && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ApplyLeave")}
        >
          <Text style={styles.buttonText}>📝 Apply for Leave</Text>
        </TouchableOpacity>
      )}

      {/* Admin */}
      {userData.role === "Admin" && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.buttonText}>👤 Create User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateTimetable")}
          >
            <Text style={styles.buttonText}>🗓️ Create Timetable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AdminLeavePanel")}
          >
            <Text style={styles.buttonText}>🗓️ Leave Notification</Text>
          </TouchableOpacity>
        </>

      )}

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
    padding: 25,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F1A",
  },
  title: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  role: {
    color: "#A259FF",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#A259FF",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    marginTop: 25,
  },
  error: {
    color: "white",
    fontSize: 18,
  },
});
