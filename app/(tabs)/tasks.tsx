import { AntDesign } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonCircle from "../../common/components/PlusButton";

interface Task {
  task_id: number;
  taskname: string;
  category_id: number;
  color: string;
}

interface Category {
  category_id: number;
  categoryname: string;
  color: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]); // Definiere den Typ für das tasks-Array
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const router = useRouter();
  const { category_id } = useLocalSearchParams<{ category_id: string }>();
  const [category, setCategory] = useState<Category[] | undefined>([]);

  useFocusEffect(
    useCallback(() => {
      console.log("current category id:" + category_id);
      getTasks();
      getCategory();
    }, [category_id])
  );

  async function getTasks() {
    try {
      let url = '/api/taskView';
      if (category_id !== undefined) {
        console.log("category id exists, view from category");
        url = `/api/taskViewByCategory?category_id=${category_id}`;
      } else {
        console.log("category id does not exist, view all");
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      console.log("tasks from category: ");
      console.log(data);
      // Fetch the category color for each task
      data = await Promise.all(data.map(async (task: Task) => {
        let color = await getCategoryColor(task.category_id);
        return { ...task, color };
      }));

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategory() {
    try {

      if (category_id === undefined) {
        console.log("category id does not exist, don't fetch category");
        return;
      }
      console.log("category id exists");
      let url = `/api/categoryDetails?category_id=${category_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("category: ");
      console.log(data);
      console.log("categoryname: ");
      console.log(data[0].categoryname);
      setCategory(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategoryColor(category_id: number) {
    try {
      const url = `/api/categoryDetails?category_id=${category_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data[0]?.color; // Access the color property from the response
    } catch (error) {
      console.error(error);
    }
  }

  // Funktion zum Aktualisieren des ausgewählten Zustands eines Tasks
  const handleTaskSelection = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const TaskItem = ({ taskname, color, task_id }: {
    taskname: string,
    color: string,
    task_id: string;
  }) => {
    return (
      <TouchableOpacity
        key={parseInt(task_id)}
        onPress={() => router.push(`/task-detail/${task_id}`)}
      >
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View
              style={[styles.square, { backgroundColor: color }]}
            ></View>
            <Text style={styles.itemText}>{taskname}</Text>
          </View>
          <CheckBox
            value={selectedTasks.includes(parseInt(task_id))}
            onValueChange={() => handleTaskSelection(parseInt(task_id))}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
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
        {/* Today's Tasks */}
        <Text style={styles.sectionTitle}>{category_id ? category?.[0]?.categoryname + " \n" : "All "}Tasks</Text>

        {/* Rendern der gefetchten Elemente */}
        <ScrollView>
          {tasks.map((task) => (
            <TaskItem
              taskname={task.taskname}
              color={task.color}
              task_id={task.task_id.toString()}
            />
          ))}
        </ScrollView>
        {/* "+"-Button am unteren Rand */}
      </View>
      <View style={styles.addButton}>
        <ButtonCircle onPress={() => router.push("taskscreate")}>
          <View>
            <AntDesign name="plus" size={24} color="white" />
          </View>
        </ButtonCircle>
      </View>
    </>
  );
}

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
  },
  square: {
    width: 24,
    height: 24,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    alignSelf: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
