// TaskDetailScreen.tsx
import { InferSelectModel } from 'drizzle-orm';
import { View, Text } from 'react-native';
import { tasks } from '../../common/db/schema';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

const TaskDetailScreen = () => {
    const [task, setTask] = useState({ taskname: '', description: '' });
    const { taskId } = useLocalSearchParams<{ taskId: string }>();

    useEffect(() => {
        const fetchTask = async () => {
            const response = await fetch(`/api/taskDetails?task_id=${taskId}`);
            const taskData = await response.json();
            console.log("Task data:");
            console.log(taskData);
            setTask({ taskname: taskData.taskname, description: taskData.description });
        };

        fetchTask();
    }, []);

    return (
        <View>
            <Text>Task Name: {task.taskname}</Text>
            <Text>Description: {task.description}</Text>
            {/* Add additional task details here */}
        </View>
    );
};

export default TaskDetailScreen;
