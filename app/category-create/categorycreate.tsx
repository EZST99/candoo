import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import ButtonCircle from "../../common/components/ButtonCircle";
import TaskInput from "../../common/components/TaskInput";
import { CategoryCreationRequest } from "../api/categoryCreation+api";

interface Props {
  back: () => void;
}

function CategoryCreation({ back }: Props) {
  const [categoryname, setCategoryname] = useState("");
  const [color, setColor] = useState("");

  const validateInput = () => {
    if (!categoryname || !color) {
      Alert.alert("Validation Error", "All fields must be filled.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setCategoryname("");
    setColor("");
    return;
  };

  async function handleCategoryCreation() {
    if (!validateInput()) {
      return;
    }

    const body: CategoryCreationRequest = {
      categoryname,
      color,
    };

    authenticatedFetch("/api/categoryCreation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log("Category Creation successful:", data);
        Alert.alert("Success", "Category successfully created.");
        resetForm();
      })
      .catch((error) => {
        console.error("Category creation failed:", error);
        Alert.alert("Error", "Failed to create category.");
      });
  }

  const ColorButton = ({ color }: { color: string }) => {
    return (
      <TouchableOpacity
        style={[styles.colorPickerItem, { backgroundColor: color }]}
        onPress={() => setColor(color)}
      ></TouchableOpacity>
    );
  };

  const colorsList = [
    { name: "Dark Red", value: "darkred" },
    { name: "Fire Brick", value: "firebrick" },
    { name: "Crimson", value: "crimson" },
    { name: "Red", value: "red" },
    { name: "Orange Red", value: "orangered" },
    { name: "Tomato", value: "tomato" },
    { name: "Indian Red", value: "indianred" },
    { name: "Orange", value: "orange" },
    { name: "Gold", value: "gold" },
    { name: "Yellow", value: "yellow" },
    { name: "Green Yellow", value: "greenyellow" },
    { name: "Light Green", value: "lightgreen" },
    { name: "Green", value: "green" },
    { name: "Light Sea Green", value: "lightseagreen" },
    { name: "Lime Green", value: "limegreen" },
    { name: "Light Sky Blue", value: "lightskyblue" },
    { name: "Sky Blue", value: "skyblue" },
    { name: "Dodger Blue", value: "dodgerblue" },
    { name: "Royal Blue", value: "royalblue" },
    { name: "Blue", value: "blue" },
    { name: "Dark Blue", value: "darkblue" },
    { name: "Purple", value: "purple" },
    { name: "Dark Magenta", value: "darkmagenta" },
    { name: "Magenta", value: "magenta" },
    { name: "Hot Pink", value: "hotpink" },
    { name: "Pink", value: "pink" },
    { name: "Light Pink", value: "lightpink" },
    { name: "White", value: "white" },
    { name: "Black", value: "black" },
    { name: "Gray", value: "gray" },
  ];

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
        <View style={styles.titleContainer}>
          <View style={styles.arrowButton}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="white"
              onPress={back}
            />
          </View>
          <Text style={styles.title}>Create Category</Text>
          <View style={styles.arrowButton}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="transparent"
            />
          </View>
        </View>
        <View style={styles.form}>
          <TaskInput
            value={categoryname}
            onChangeText={setCategoryname}
            placeholder="Category Name"
          />

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
            {color != "" ? (
              <Text>{colorsList.find((c) => c.value === color)?.name}</Text>
            ) : (
              <Text style={{ color: "rgba(0, 0, 0, 0.19)" }}>Pick a color</Text>
            )}
          </View>
          <View style={styles.colorPicker}>
            {colorsList.map((color) => (
              <ColorButton key={color.value} color={color.value} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.btn}>
        <ButtonCircle onPress={handleCategoryCreation}>
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: 20,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",

  },
  colorPicker: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.19)",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    flexDirection: "row", // align items in a row
    flexWrap: "wrap", // prevent items from wrapping onto a new line
    justifyContent: "center", // align items in the center
  },
  colorPickerItem: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CategoryCreation;
