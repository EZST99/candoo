import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../common/components/Button";
import Input from "../../common/components/Input";
// npm i react-native-date-picker
import DatePicker from 'react-native-date-picker';

interface Props {
    back: () => void;
  }

function taskCreation({ back }: Props) {
    const [taskname, setTaskname] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [importance, setImportance] = useState("");
    const [urgency, setUrgency] = useState("");
  
    async function handleTaskCreation() {
      fetch("/api/taskCreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskname, description, dueDate, importance, urgency }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Erfolgreiche task
          console.log("Task Creation successful:", data);
        })
        .catch((error) => {
          console.error("Registration failed:", error);
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
            <Text style={styles.title}>Create task</Text>
          </View>
          <View style={styles.form}>
            <Input
              value={taskname}
              onChangeText={setTaskname}
              placeholder="Name"
            />
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
            />
            <Button title="Due Date" onPress={() => setOpen(true)} />
            <DatePicker
              modal
              open={open}
              date={dueDate}
              onConfirm={(date) => {
                setOpen(false)
                setDueDate(date)
            }}
            onCancel={() => {
                setOpen(false)
              }}
            />
            <Input
              value={importance}
              onChangeText={setImportance}
              placeholder="Pick Importance"
            />
            <Input
              value={urgency}
              onChangeText={setUrgency}
              placeholder="Pick Urgency"
            />
          </View>
        </View>
        <View style={styles.btn}>
          <Button title="Let's get started" onPress={handleTaskCreation} />
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
      gap: 10,
    },
    btn: {
      position: "absolute",
      bottom: 24,
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    titleContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 24,
    },
    title: {
      fontSize: 24,
      fontFamily: "Inter",
      fontWeight: "700",
      color: "#000000",
      flex: 1,
      textAlign: "center",
      transform: [{ translateX: -12 }],
    },
  });

export default taskCreation;