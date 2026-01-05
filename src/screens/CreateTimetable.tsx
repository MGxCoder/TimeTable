import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../components/CustomButton";
import localSubjects from "../data/subjects.json"; // Fallback JSON

type Slot = {
  id?: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
};

type Subject = {
  name: string;
  teacher: string;
  year: string;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "8:45-9:45",
  "9:45-10:45",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
];

const CreateTimetableScreen: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Partial<Slot>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [year, setYear] = useState<string>("2025");
  const [className, setClassName] = useState<string>("BE-B");

  // Fetch subjects by year
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await firestore()
          .collection("subjects")
          .where("year", "==", year)
          .get();

        if (!snapshot.empty) {
          const subs = snapshot.docs.map((doc) => doc.data() as Subject);
          setSubjects(subs);
        } else {
          const local = localSubjects.filter((s) => s.year === year);
          setSubjects(local);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        const local = localSubjects.filter((s) => s.year === year);
        setSubjects(local);
      }
    };
    fetchSubjects();
  }, [year]);

  // Fetch timetable for selected class
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("timetable")
      .doc(`${year}_${className}`)
      .onSnapshot((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setSlots((data?.slots as Slot[]) || []);
        } else {
          setSlots([]);
        }
      });

    return unsubscribe;
  }, [year, className]);

  // Save slot with conflict detection
  const handleSaveSlot = async () => {
    if (!selectedSlot.day || !selectedSlot.time || !selectedSlot.subject) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    const newSlot: Slot = {
      id: Date.now().toString(),
      day: selectedSlot.day!,
      time: selectedSlot.time!,
      subject: selectedSlot.subject!,
      teacher: selectedSlot.teacher || "",
      room: selectedSlot.room || "",
    };

    try {
      // 🔹 1️⃣ Check if this teacher already has a class at the same time/day in ANY class of same year
      const timetableSnap = await firestore().collection("timetable").get();
      let conflictFound = false;

      timetableSnap.forEach((doc) => {
        const data = doc.data();
        const allSlots = data.slots || [];
        allSlots.forEach((slot: Slot) => {
          if (
            slot.teacher === newSlot.teacher &&
            slot.day === newSlot.day &&
            slot.time === newSlot.time
          ) {
            conflictFound = true;
          }
        });
      });

      if (conflictFound) {
        Alert.alert(
          "Scheduling Conflict",
          `❌ ${newSlot.teacher} already has a lecture at ${newSlot.time} on ${newSlot.day}.`
        );
        return; // stop here
      }

      // 🔹 2️⃣ Save if no conflict
      const updatedSlots = [...slots, newSlot];
      await firestore()
        .collection("timetable")
        .doc(`${year}_${className}`)
        .set({ year, class: className, slots: updatedSlots }, { merge: true });

      setSlots(updatedSlots);
      setModalVisible(false);
      setSelectedSlot({});
    } catch (error) {
      console.error("Error saving slot:", error);
      Alert.alert("Error", "Failed to save slot");
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    const filtered = slots.filter((s) => s.id !== slotId);
    try {
      await firestore()
        .collection("timetable")
        .doc(`${year}_${className}`)
        .update({ slots: filtered });
      setSlots(filtered);
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧩 Create Timetable</Text>

      <TextInput
        placeholder="Enter Year"
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

      <CustomButton title="Add Slot" onPress={() => setModalVisible(true)} />

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.slotText}>
              📅 {item.day} | 🕐 {item.time}
            </Text>
            <Text style={styles.slotText}>📘 {item.subject}</Text>
            <Text style={styles.slotText}>👩‍🏫 {item.teacher}</Text>
            <Text style={styles.slotText}>🏫 {item.room}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSlot(item.id!)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Slot</Text>

            <Picker
              selectedValue={selectedSlot.day}
              onValueChange={(v) => setSelectedSlot({ ...selectedSlot, day: v })}
            >
              <Picker.Item label="Select Day" value="" />
              {days.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedSlot.time}
              onValueChange={(v) => setSelectedSlot({ ...selectedSlot, time: v })}
            >
              <Picker.Item label="Select Time" value="" />
              {times.map((t) => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedSlot.subject}
              onValueChange={(v) => {
                const sub = subjects.find((s) => s.name === v);
                setSelectedSlot({
                  ...selectedSlot,
                  subject: v,
                  teacher: sub?.teacher || "",
                });
              }}
            >
              <Picker.Item label="Select Subject" value="" />
              {subjects.length > 0 ? (
                subjects.map((s) => (
                  <Picker.Item key={s.name} label={s.name} value={s.name} />
                ))
              ) : (
                <Picker.Item label="No subjects found" value="none" />
              )}
            </Picker>

            <TextInput
              placeholder="Enter Room"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={selectedSlot.room}
              onChangeText={(v) => setSelectedSlot({ ...selectedSlot, room: v })}
            />

            <CustomButton title="Save Slot" onPress={handleSaveSlot} />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CreateTimetableScreen;

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
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  slotText: { color: "white", fontSize: 16 },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalBox: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    color: "#A259FF",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  cancelText: {
    color: "#FF5555",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});
