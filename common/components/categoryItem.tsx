import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface Props extends TouchableOpacityProps {
  categoryname: string;
  color: string;
  category_id: string;
}

const CategoryItem = (props: Props) => {
  return (
    <TouchableOpacity
      key={parseInt(props.category_id)}
      onPress={() => router.push(`/tasks?category_id=${props.category_id}`)} //--> route to tasks with the category id passed (select * from tasks where category_id = ...)
    >
      <View key={props.category_id} style={styles.item}>
        <View style={styles.itemLeft}>
          <View
            style={[styles.square, { backgroundColor: props.color }]}
          ></View>
          <Text style={styles.categoryText}>{props.categoryname}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  square: {
    width: 25,
    height: 25,
    borderRadius: 5,
    marginRight: 15,
  },
  categoryText: {
    alignSelf: "center",
  },
});

export default CategoryItem;
