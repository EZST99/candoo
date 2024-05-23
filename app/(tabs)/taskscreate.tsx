import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import authenticatedFetch from "../../common/authenticatedFetch";
import ButtonCircle from "../../common/components/ButtonCircle";
import TaskInput from "../../common/components/TaskInput";
import { TaskCreationRequest } from "../api/taskCreation+api";
import ScrollPicker from "react-native-wheel-scrollview-picker";

interface Category {
  categoryname: string;
  category_id: string;
}

function TaskCreation() {
  const [category_id, setCategory_id] = useState("");
  const [taskname, setTaskname] = useState("");
  const [description, setDescription] = useState("");
  const [due_date, setDue_date] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [importance, setImportance] = useState("");
  const [showImportance, setShowImportance] = useState(false);
  const [urgency, setUrgency] = useState("");
  const [showUrgency, setShowUrgency] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getCategory();
    }, [])
  );

  const setDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || due_date;
    setShow(false); // Close the DateTimePicker after selecting a date
    setDue_date(currentDate);
  };

  const validateInput = () => {
    if (!taskname || !category_id || !importance || !urgency || !due_date) {
      Alert.alert("Validation Error", "All fields must be filled.");
      return false;
    }
    if (
      isNaN(parseInt(importance)) ||
      isNaN(parseInt(urgency)) ||
      parseInt(importance) < 1 ||
      parseInt(urgency) < 1
    ) {
      Alert.alert(
        "Validation Error",
        "Importance and urgency must be positive numbers."
      );
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setCategory_id("");
    setTaskname("");
    setDescription("");
    setDue_date(null);
    setImportance("");
    setUrgency("");
    return;
  };

  async function handleTaskCreation() {
    if (!validateInput()) {
      return;
    }

    const body: TaskCreationRequest = {
      category_id: Number(category_id),
      taskname,
      description,
      due_date: due_date || new Date(), // Assign a default value of new Date() if due_date is null
      importance: Number(importance),
      urgency: Number(urgency),
    };

    authenticatedFetch("/api/taskCreation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log("Task Creation successful:", data);
        Alert.alert("Success", "Task successfully created.");
        resetForm();
      })
      .catch((error) => {
        console.error("Task creation failed:", error);
        Alert.alert("Error", "Failed to create task.");
      });
  }

  async function getCategory() {
    try {
      const data = await authenticatedFetch("/api/categoryView", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

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
        <Text style={styles.title}>Create Task</Text>
        <ScrollView style={styles.form}>
          <TaskInput
            value={taskname}
            onChangeText={setTaskname}
            placeholder="Task Name"
          />
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            data={categories}
            placeholderStyle={{ color: "rgba(0, 0, 0, 0.19)" }}
            labelField="categoryname"
            valueField="category_id"
            value={category_id}
            placeholder={!isFocus ? "Select category" : "..."}
            onChange={(item) => {
              setCategory_id(item.category_id);
              setIsFocus(false);
            }}
          />
          <TaskInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />
          {showImportance ? (
            <ScrollPicker
              dataSource={["Pick Importance", "1", "2", "3", "4", "5"]}
              selectedIndex={importance == "" ? 0 : parseInt(importance)}
              renderItem={(data, index) => {
                return (<View><Text style={data === "Pick Importance" ? { color: "rgba(0, 0, 0, 0.19)" } : {}}>{data}</Text></View>);
              }}
              onValueChange={(data, selectedIndex) => {
                if (data === "Pick Importance") {
                  // Ignore selection of the disabled option
                  return;
                }
                setImportance(data);
                setShowImportance(false);
              }}
              wrapperHeight={150}
              wrapperBackground="#FFFFFF"
              itemHeight={50}
              highlightColor="rgba(0, 0, 0, 0.19)"
              highlightBorderWidth={3}
            />
          ) : (
            <TouchableWithoutFeedback
              onPress={() => setShowImportance(true)}
              style={{ padding: 10 }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "rgba(0, 0, 0, 0.19)",
                  margin: 10,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                {importance == "" ? (
                  <Text style={{ color: "rgba(0, 0, 0, 0.19)" }}>
                    Pick Importance
                  </Text>
                ) : (
                  <Text>Importance: {importance}</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}


          {showUrgency ? (
            <ScrollPicker
              dataSource={["Pick Urgency", "1", "2", "3", "4", "5"]}
              selectedIndex={urgency == "" ? 0 : parseInt(urgency)}
              renderItem={(data, index) => {
                return (<View><Text style={data === "Pick Urgency" ? { color: "rgba(0, 0, 0, 0.19)" } : {}}>{data}</Text></View>);
              }}
              onValueChange={(data, selectedIndex) => {
                if (data === "Pick Urgency") {
                  // Ignore selection of the disabled option
                  return;
                }
                setUrgency(data);
                setShowUrgency(false);
              }}
              wrapperHeight={150}
              wrapperBackground="#FFFFFF"
              itemHeight={50}
              highlightColor="rgba(0, 0, 0, 0.19)"
              highlightBorderWidth={3}
            />
          ) : (
            <TouchableWithoutFeedback
              onPress={() => setShowUrgency(true)}
              style={{ padding: 10 }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "rgba(0, 0, 0, 0.19)",
                  margin: 10,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                {urgency == "" ? (
                  <Text style={{ color: "rgba(0, 0, 0, 0.19)" }}>
                    Pick Urgency
                  </Text>
                ) : (
                  <Text>Urgency: {urgency}</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
          {/* Abstand nach dem DatePicker */}
          <View style={{ height: 110 }} />
        </ScrollView>
      </View>

      <View style={styles.btn}>
        <ButtonCircle onPress={handleTaskCreation}>
          <View>
            <Feather name="check" size={24} color="white" />
          </View>
        </ButtonCircle>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  btn: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#fff",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.19)",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    textAlign: "center",
  },
  dateTimePickerContainer: {
    marginBottom: 10, // Abstand unterhalb des DateTimePicker
  },
  pickDueDateContainer: {
    marginBottom: 10, // Abstand unterhalb des Pick Due Date
  },
});

export default TaskCreation;
