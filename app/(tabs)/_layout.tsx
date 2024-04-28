import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "#909090",
      tabBarStyle: {
        backgroundColor: "rgba(255, 0, 0, 0.72)",
        
        
      }}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="taskscreate"
        options={{
          title: "Create Task",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
