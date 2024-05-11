import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import authenticatedFetch from "../../common/authenticatedFetch";
import ButtonCircle from "../../common/components/ButtonCircle";
import CategoryItem from "../../common/components/categoryItem";

interface Category {
  categoryname: string;
  color: string;
  category_id: string;
}

export default function category() {
  const [categories, setCategories] = useState<Category[]>([]); // Definiere den Typ für das category-Array
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getCategory();
    }, [])
  );

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
              category_id={category.category_id}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.addButton}>
        <ButtonCircle
          onPress={() => router.push("../category-create/categorycreate")}
        >
          <View>
            <AntDesign name="plus" size={24} color="white" />
          </View>
        </ButtonCircle>
      </View>
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
