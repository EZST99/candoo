import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import CheckBox from "expo-checkbox";
import { tasks } from "../../common/db/schema";
import { check } from "drizzle-orm/pg-core";
import TouchableOpacity from "../../common/components/TouchableOpacity";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ButtonCircle from "../../common/components/PlusButton";
import { router} from "expo-router";

interface Task {
  task_id: number;
  taskname: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // Zustand für die ausgewählten Tasks

  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    try {
      const response = await fetch("/api/taskView", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Funktion zum Aktualisieren des ausgewählten Zustands eines Tasks
  const handleTaskSelection = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  return (
    <>
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(255, 0, 0, 0.72)", "white"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "110%",
        }}
      />
      {/* Today's Tasks */}
      <Text style={styles.sectionTitle}>Tasks</Text>

      {/* Rendern der gefetchten Elemente */}
      {tasks.map((task) => (
        <View key={task.task_id} style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={styles.square}></View>
            <Text>{task.taskname}</Text>
          </View>
          <CheckBox
            value={selectedTasks.includes(task.task_id)}
            onValueChange={() => handleTaskSelection(task.task_id)}
          />
        </View>
      ))}
      {/* "+"-Button am unteren Rand */}
    </View>
      <View style={styles.addButton}>  
      <ButtonCircle onPress={() => router.push('taskscreate')}>
        <View>
      <AntDesign name="plus" size={24} color="white" />
        </View>
      </ButtonCircle>
      </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    /*alignItems: "center",
    justifyContent: "center",*/
  },
  tasksWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 20,
  },
  items: {
    marginTop: 30,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55BCF6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
