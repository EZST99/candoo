import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native'; // Import the View component
import { Link } from 'expo-router';

interface Task {
    task_id: number;
    taskname: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]); // Define the type for tasks array
    const router = useRouter()

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
            <Link href="/task-detail">Details</Link>
            <Pressable onPress={() => router.push("/task-detail")}>
            {/* Hier renderst du die gefetchten Elemente */}
            {tasks.map(task => (
                    <Text>{task.taskname}</Text>
            ))}
            </Pressable>
        </View>
    );
}
