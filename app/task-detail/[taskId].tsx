// TaskDetailScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Button from "../../common/components/Button";

const TaskDetailScreen = () => {
  const [task, setTask] = useState({ taskname: "", category: "", due_date: "", importance: "", urgency: "", description: "" });
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  useEffect(() => {
    const fetchTask = async () => {
      const response = await fetch(`/api/taskDetails?task_id=${taskId}`);
      const taskData = await response.json();
      console.log("Task data:");
      console.log(taskData);
      setTask({
        taskname: taskData.taskname,
        category: taskData.category,
        due_date: new Date(taskData.due_date).toDateString(),
        importance: taskData.importance,
        urgency: taskData.urgency,
        description: taskData.description,
      });
    };

    fetchTask();
  }, []);

  return (
    <View>
      <Text>Task Name: {task.taskname}</Text>
      <Text>Category: {task.category}</Text>
      <Text>Due Date: {task.due_date}</Text>
      <Text>Importance: {task.importance}</Text>
      <Text>Urgency: {task.urgency}</Text>
      <Text>Description: {task.description}</Text>
      {/* Add additional task details here */}
      <Button
        title="Delete"
        onPress={() => {
          Alert.alert("Delete Task", "Are you sure you want to delete this task?\n\"" + task.taskname + "\" will be permanently deleted.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                await fetch(`/api/taskDeletion`, {
                  method: "DELETE",
                  body: JSON.stringify({ task_id: taskId }),
                });
                Alert.alert("Success", "Task successfully deleted.");
                router.push(`../tasks`);
              },
            },
          ],
          );
        }}
      />
    </View>
  );
};

export default TaskDetailScreen;
