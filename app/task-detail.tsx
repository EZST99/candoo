// TaskDetailScreen.tsx
import { InferSelectModel } from 'drizzle-orm';
import { View, Text } from 'react-native';
import { tasks } from '../common/db/schema';
import React, { useEffect, useState } from 'react';

const TaskDetailScreen = () => {
    const [task, setTask] = useState({ taskname: '', description: '' });

    useEffect(() => {
        const fetchTask = async () => {
            const response = await fetch('/api/taskView');
            const taskData = await response.json();
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
