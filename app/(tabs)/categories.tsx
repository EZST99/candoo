import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import ButtonCircle from "../../common/components/ButtonCircle";
import CategoryItem from "../../common/components/categoryItem";
import CategoryCreation from "../category-create/categorycreate";

interface Category {
  categoryname: string;
  color: string;
  category_id: string;
}

export default function category() {
  const [categories, setCategories] = useState<Category[]>([]); // Definiere den Typ für das category-Array
  const router = useRouter();
  const [view, setView] = React.useState<null | "createCategories">(null);

  useFocusEffect(
    useCallback(() => {
      getCategory();
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      if (view !== null) {
        setView(null);
        return true;
      }

      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [view]);

  async function getCategory() {
    try {
      const data = await authenticatedFetch<Array<Category>>(
        "/api/categoryView",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>

      {view === null ? (
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
          <Text style={styles.title}>Categories</Text>
          <ScrollView>
            {categories.map((category) => (
              <CategoryItem
                categoryname={category.categoryname}
                color={category.color}
                category_id={category.category_id.toString()}
              />
            ))}
          </ScrollView>
          <View style={styles.addButton}>
            <ButtonCircle
              onPress={() => setView("createCategories")}
            >
              <View>
                <AntDesign name="plus" size={24} color="white" />
              </View>
            </ButtonCircle>
          </View>
        </View>

      ) : null}
      {view === "createCategories" ? <CategoryCreation back={() => setView(null)} /> : null}

    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
