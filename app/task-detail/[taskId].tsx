// TaskDetailScreen.tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Button from "../../common/components/Button";

const TaskDetailScreen = () => {
  const [task, setTask] = useState({ taskname: "", description: "" });
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  useEffect(() => {
    const fetchTask = async () => {
      const response = await fetch(`/api/taskDetails?task_id=${taskId}`);
      const taskData = await response.json();
      console.log("Task data:");
      console.log(taskData);
      setTask({
        taskname: taskData.taskname,
        description: taskData.description,
      });
    };

    fetchTask();
  }, []);

  return (
    <View>
      <Text>Task Name: {task.taskname}</Text>
      <Text>Description: {task.description}</Text>
      {/* Add additional task details here */}
      <Button
        title="Delete"
        onPress={() => {
          fetch(`/api/taskDeletion`, {
            method: "DELETE",
            body: JSON.stringify({ task_id: taskId }),
          });
        }}
      />
    </View>
  );
};

export default TaskDetailScreen;
