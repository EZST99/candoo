import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, ScrollView } from "react-native";
import TaskInput from "../../common/components/TaskInput";
import ButtonCircle from "../../common/components/ButtonCircle";
import { LinearGradient } from 'expo-linear-gradient'; // npx expo install expo-linear-gradient
import { CategoryCreationRequest } from "../api/categoryCreation+api";

interface Props {
    back: () => void;
}

function CategoryCreation({ back }: Props) {

    const [categoryname, setCategoryname] = useState("");
    const [user_id, setUser_id] = useState(1);
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
    }

    async function handleCategoryCreation() {
        if (!validateInput()) {
            return;
        }

        const body: CategoryCreationRequest = {
            categoryname,
            user_id,
            color,
        };

        fetch("/api/categoryCreation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
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
                    <TaskInput
                        value={categoryname}
                        onChangeText={setCategoryname}
                        placeholder="Category Name"
                    />
                    <TaskInput
                        value={color}
                        onChangeText={setColor}
                        placeholder="Color"
                    />
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

export default CategoryCreation;
