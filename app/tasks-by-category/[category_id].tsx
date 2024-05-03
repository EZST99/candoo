import { AntDesign } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ButtonCircle from "../../common/components/PlusButton";

interface Task {
  task_id: number;
  taskname: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]); // Definiere den Typ für das tasks-Array
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const router = useRouter();
  const { category_id } = useLocalSearchParams<{ category_id: string }>();

  useFocusEffect(
    useCallback(() => {
      getTasks();
    }, [])
  );

  async function getTasks() {
    try {
      const response = await fetch(`/api/taskViewByCategory?category_id=${category_id}`, {
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
        <Text style={styles.sectionTitle}>{category_id}</Text>

        {/* Rendern der gefetchten Elemente */}
        <ScrollView>
          {tasks.map((task) => (
            <Pressable
              key={task.task_id}
              onPress={() => router.push(`/task-detail/${task.task_id}`)}
            >
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
            </Pressable>
          ))}
        </ScrollView>
        {/* "+"-Button am unteren Rand */}
      </View>
      <View style={styles.addButton}>
        <ButtonCircle onPress={() => router.push("taskscreate")}>
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

    fontFamily: "Inter",
    fontWeight: "700",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 20,
  },
  items: {
    marginTop: 30,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
    bottom: 24,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
