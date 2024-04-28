import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native'; // Import the View component

interface Task {
    task_id: number;
    taskname: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]); // Define the type for tasks array

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
            setTasks(data); // Hier werden die empfangenen Daten in den State gesetzt
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            {/* Hier renderst du die gefetchten Elemente */}
            {tasks.map(task => (
                    <Text>{task.taskname}</Text>
            ))}
        </View>
    );
}
