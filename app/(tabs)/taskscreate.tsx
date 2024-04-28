import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Button from "../../common/components/Button";
import Input from "../../common/components/Input";
import { TaskCreationRequest } from "../api/taskCreation+api";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TouchableOpacity from "../../common/components/TouchableOpacity";
import { LinearGradient } from 'expo-linear-gradient'; // npx expo install expo-linear-gradient

interface Props {
  back: () => void;
}

function TaskCreation({ back }: Props) {
  const [taskname, setTaskname] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [due_date, setDue_date] = useState(new Date());
  const [show, setShow] = useState(false);
  const [importance, setImportance] = useState("");
  const [urgency, setUrgency] = useState("");

  const toggleDatepicker = () => {
    setShow(!show);
  };

  const setDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || due_date;
    setShow(false); // Close the DateTimePicker after selecting a date
    setDue_date(currentDate);
  };



  const validateInput = () => {
    if (!taskname || !category || !description) {
      Alert.alert("Validation Error", "All fields must be filled.");
      return false;
    }
    if (isNaN(parseInt(importance)) || isNaN(parseInt(urgency)) || parseInt(importance) < 1 || parseInt(urgency) < 1) {
      Alert.alert("Validation Error", "Importance and urgency must be positive numbers.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setTaskname("");
    setCategory("");
    setDescription("");
    setDue_date(new Date());
    setImportance("");
    setUrgency("");
    return;
  }

  async function handleTaskCreation() {
    if (!validateInput()) {
      return;
    }

    const body: TaskCreationRequest = {
      taskname,
      category,
      description,
      due_date,
      importance: Number(importance),
      urgency: Number(urgency),
    };

    fetch("/api/taskCreation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
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

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={['rgba(255, 0, 0, 0.72)', 'white']}
          style={
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '110%',
            }
          }
        />
        <View style={styles.titleContainer}>
          <View>
            <AntDesign
              name="arrowleft"
              size={24}
              color="white"
              onPress={back}
            />
          </View>
          <Text style={styles.title}>Create Task</Text>
        </View>
        <View style={styles.form}>
          <Input
            value={taskname}
            onChangeText={setTaskname}
            placeholder="Task Name"
          />
          <Input
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
          />
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />

          <Input
            keyboardType="number-pad"
            value={importance}
            onChangeText={setImportance}
            placeholder="Pick Importance"
          />
          <Input
            keyboardType="number-pad"
            value={urgency}
            onChangeText={setUrgency}
            placeholder="Pick Urgency"
          />

          <View style={{
            backgroundColor: "#fff",
            borderWidth: 3,
            borderColor: "rgba(0, 0, 0, 0.19)",
            margin: 10,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DateTimePicker mode="date" value={due_date} onChange={setDate} />
          </View>
        </View>
      </View>

      <View style={styles.btn}>
        <TouchableOpacity onPress={handleTaskCreation}>
          <View>
            <Feather name="check" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 24,
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
});

export default TaskCreation;
