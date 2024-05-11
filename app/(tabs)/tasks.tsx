import { AntDesign } from "@expo/vector-icons";
import { InferSelectModel } from "drizzle-orm";
import CheckBox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import ButtonCircle from "../../common/components/PlusButton";
import { tasks as tasksTable } from "../../common/db/schema";
import { MarkAsDoneResult } from "../api/markAsDone+api";

interface Category {
  category_id: number;
  categoryname: string;
  color: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<
    (InferSelectModel<typeof tasksTable> & { color: string })[]
  >([]); // Definiere den Typ für das tasks-Array
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
      let url = "/api/taskView";
      if (category_id !== undefined) {
        console.log("category id exists, view from category");
        url = `/api/taskView?category_id=${category_id}`;
      } else {
        console.log("category id does not exist, view all");
      }

      let data = await authenticatedFetch<
        Array<InferSelectModel<typeof tasksTable>>
      >(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("tasks from category: ");
      console.log(data);
      // Fetch the category color for each task
      data = await Promise.all(
        data.map(async (task) => {
          let color = await getCategoryColor(task.category_id);
          return { ...task, color };
        })
      );

      setTasks(
        data as (InferSelectModel<typeof tasksTable> & { color: string })[]
      );
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
      const data = await authenticatedFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      const data = await authenticatedFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data[0]?.color; // Access the color property from the response
    } catch (error) {
      console.error(error);
    }
  }

  // Funktion zum Aktualisieren des ausgewählten Zustands eines Tasks
  const handleTaskSelection = (taskId: number) => {
    const newDoneState = !tasks.find((task) => task.task_id === taskId)
      ?.is_done;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, is_done: newDoneState } : task
      )
    );

    authenticatedFetch<MarkAsDoneResult>("/api/markAsDone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_id: taskId,
        is_done: newDoneState,
      }),
    })
      .then(({ task_id, is_done }) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === task_id ? { ...task, is_done } : task
          )
        );
      })
      .catch((error) => {
        console.error("Task selection failed:", error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? { ...task, is_done: !newDoneState } : task
          )
        );
      });
  };

  const TaskItem = ({
    taskname,
    color,
    task_id,
    is_done,
  }: {
    taskname: string;
    color: string;
    task_id: string;
    is_done: boolean;
  }) => {
    return (
      <TouchableOpacity
        key={parseInt(task_id)}
        onPress={() => router.push(`/task-detail/${task_id}`)}
      >
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.square, { backgroundColor: color }]}></View>
            <Text style={styles.itemText}>{taskname}</Text>
          </View>
          <CheckBox
            value={is_done}
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
        <Text style={styles.sectionTitle}>
          {category_id ? category?.[0]?.categoryname + " \n" : "All "}Tasks
        </Text>

        {/* Rendern der gefetchten Elemente */}
        <ScrollView>
          {tasks
            // sort based on created at and sort done tasks to the bottom
            .sort((a, b) => {
              if (a.is_done === b.is_done) {
                return a.created_at < b.created_at ? 1 : -1;
              }
              return a.is_done ? 1 : -1;
            })
            .map((task) => (
              <TaskItem
                taskname={task.taskname}
                color={task.color}
                task_id={task.task_id.toString()}
                is_done={task.is_done}
                key={task.task_id}
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
