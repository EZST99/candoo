import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Button from "../../common/components/Button";
import Input from "../../common/components/Input";
import { TaskCreationRequest } from "../api/taskCreation+api";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TouchableOpacity from "../../common/components/TouchableOpacity";

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
    })
    .catch((error) => {
      console.error("Task creation failed:", error);
      Alert.alert("Error", "Failed to create task.");
    });
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View>
            <AntDesign
              name="arrowleft"
              size={24}
              color="black"
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
          {/* <Button title="Due Date" onPress={toggleDatepicker} />
          {show && (
            <DateTimePicker
              mode="date"
              display="default"
              value={due_date}
              onChange={(event, selectedDate) => {
                setDue_date(selectedDate || due_date);
                setShow(false);
              }}
            />
          )} */}
          
          {show ? <DateTimePicker mode="date" value={due_date} onChange={setDate} /> : null}

          <TouchableOpacity onPress={() => setShow(true)}>
              <View>
                <Text>
                  {due_date.toDateString()}
                </Text>
              </View>
            </TouchableOpacity>

          <Input
            keyboardType="numeric"
            value={importance}
            onChangeText={setImportance}
            placeholder="Pick Importance"
          />
          <Input
            keyboardType="numeric"
            value={urgency}
            onChangeText={setUrgency}
            placeholder="Pick Urgency"
          />
        </View>
      </View>
      <View style={styles.btn}>
        <Button title="Create Task" onPress={handleTaskCreation} />
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
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  btn: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
});

export default TaskCreation;
