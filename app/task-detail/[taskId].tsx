// TaskDetailScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import Button from "../../common/components/Button";

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

  return (
    <View>
      <Text>Task Name: {task.taskname}</Text>
      <Text>Category: {category}</Text>
      <Text>Due Date: {task.due_date}</Text>
      <Text>Importance: {task.importance}</Text>
      <Text>Urgency: {task.urgency}</Text>
      <Text>Description: {task.description}</Text>
      {/* Add additional task details here */}
      <Button
        title="Delete"
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
  );
};

export default TaskDetailScreen;
