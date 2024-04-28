// Importiere useRouter aus 'expo-router'
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native'; // Importiere die View-Komponente

interface Task {
    task_id: number;
    taskname: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]); // Definiere den Typ für das tasks-Array
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
            {tasks.map(task => (
                <Pressable key={task.task_id} onPress={() => router.push(`/task-detail/${task.task_id}`)}>
                    <Text>{task.taskname}</Text>
                </Pressable>
            ))}
        </View>
    );
}
