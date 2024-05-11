// TaskDetailScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet, TextInput } from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import { LinearGradient } from "expo-linear-gradient";
import ButtonCircle from "../../common/components/ButtonCircle";
import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { TaskUpdateRequest } from "../api/taskDetailEdit+api";

const TaskDetailScreen = () => {
  const [task, setTask] = useState({
    taskname: "",
    category_id: "",
    due_date: "",
    importance: "",
    urgency: "",
    description: "",
  });
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const [category, setCategory] = useState("");

  const fetchTask = async () => {
    const taskData = await authenticatedFetch(
      `/api/taskDetails?task_id=${taskId}`
    );
    console.log("Task data:");
    console.log(taskData);
    setTask({
      taskname: taskData.taskname,
      category_id: taskData.category_id,
      due_date: new Date(taskData.due_date).toDateString(),
      importance: taskData.importance,
      urgency: taskData.urgency,
      description: taskData.description,
    });
  };

  const fetchCategoryname = async () => {
    const taskData = await authenticatedFetch(
      `/api/categoryDetails?category_id=${task.category_id}`
    );
    console.log("Category data:");
    console.log(taskData);
    setCategory(taskData[0].categoryname);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  useEffect(() => {
    fetchCategoryname();
  }, [task.category_id]);
  
  const validateInput = () => {
    if (
      isNaN(parseInt(task.importance)) ||
      isNaN(parseInt(task.urgency)) ||
      parseInt(task.importance) < 1 ||
      parseInt(task.urgency) < 1
    ) {
      Alert.alert(
        "Validation Error",
        "Importance and urgency must be positive numbers."
      );
      return false;
    }
    return true;
  };
  

  async function handleTaskUpdate() {
    if (!validateInput()) {
      return;
    }

    const body: TaskUpdateRequest = {
      task_id: Number(taskId),
      category_id: Number(task.category_id),
      taskname: task.taskname,
      due_date: new Date(task.due_date),
      description : task.description,
      importance: Number(task.importance),
      urgency: Number(task.urgency),
    };

    authenticatedFetch("../api/taskDetailEdit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log("Task Update successful:", data);
        Alert.alert("Success", "Task successfully updated.");
      })
      .catch((error) => {
        console.error("Task Update failed:", error);
        Alert.alert("Error", "Failed to update task.");
      });
  }

  
  return (
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
      <View style={styles.tasksWrapper}>
        <TextInput 
        style={styles.categoryTitle}>
          {category}
          </TextInput>
        <TextInput style={styles.sectionTitle}>{task.taskname}</TextInput>
        <View style={styles.items}>
          <TextInput 
          style={styles.itemLeft}>
            Due Date: {task.due_date}
          </TextInput>
          <TextInput 
          keyboardType="number-pad"
          style={styles.itemLeft}
          onChangeText={(number) => setTask({ ...task, importance: number })}>
            Importance: {task.importance}
            </TextInput>
          <TextInput 
          keyboardType="number-pad"
          style={styles.itemLeft}>
            Urgency: {task.urgency}
          </TextInput>
          <Text style={styles.itemLeft}>Description: {task.description}</Text>
          <TextInput style={styles.item}
            onChangeText={(text) => setTask({ ...task, description: text })}
            placeholder="Task Description"
          />
        </View>
      {/* Add additional task details here */}
      <View style={styles.delbtn}>
      <MaterialIcons name="delete-outline" size={24} color="white"
        onPress={() => {
          Alert.alert(
            "Delete Task",
            'Are you sure you want to delete this task?\n"' +
              task.taskname +
              '" will be permanently deleted.',
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: async () => {
                  await authenticatedFetch(`/api/taskDeletion`, {
                    method: "DELETE",
                    body: JSON.stringify({ task_id: taskId }),
                  });
                  Alert.alert("Success", "Task successfully deleted.");
                  router.push(`../tasks`);
                },
              },
            ]
          );
        }}
      />
      </View>
      <View style={styles.btn}>
        <ButtonCircle onPress={handleTaskUpdate}>
          <View>
            <Feather name="check" size={24} color="white" />
          </View>
        </ButtonCircle>
      </View>
    </View>
  </View>
  );
};

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
    textAlign: "center",
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
    color: "#fff",
    marginBottom: 10,
  },
  itemText: {
    alignSelf: "center",
  },
  categoryTitle: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  btn: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  delbtn: {
    position: "relative",
    paddingHorizontal: 20,
    paddingVertical: 30,
    bottom: 10,
    width: "100%",
    color: "white",
    },
});

export default TaskDetailScreen;
