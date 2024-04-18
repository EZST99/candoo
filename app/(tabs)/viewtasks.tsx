/*import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

interface Task {
  taskname: string;
  category: string;
  due_date: string;
  description: string;
  importance: number;
  urgency: number;
}
  async function handleTaskCreation() {
    fetch("/api/taskCreation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task Creation successful:", data);
        Alert.alert("Success", "Task successfully created.");
      })
      .catch((error) => {
        console.error("Task creation failed:", error);
        Alert.alert("Error", "Failed to create task.");
      });
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      {tasks.map((task, index) => (
        <View key={index} style={styles.taskContainer}>
          <Text>Task: {task.taskname}</Text>
          <Text>Category: {task.category}</Text>
          <Text>Due Date: {task.due_date}</Text>
          <Text>Description: {task.description}</Text>
          <Text>Importance: {task.importance}</Text>
          <Text>Urgency: {task.urgency}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskContainer: {
    marginBottom: 20,
  },
});

export default TaskList;
*/