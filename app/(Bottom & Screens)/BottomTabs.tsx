import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import CartScreen from "./CartScreen";
import SearchScreen from "./SearchScreen";
import CategoryScreen from "./CategoryScreen";
import CustomDrawer from "../drawer/CustomDrawerContent";
import { ApiProvider } from "../../context/ApiContext";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// 🔥 Bottom Navigation
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let icon;
          let color = focused ? "#FF5555" : "#aaa";
          let size = 18;

          if (route.name === "Home") {
            icon = <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
          } else if (route.name === "Cart") {
            icon = <MaterialIcons name="shopping-cart" size={size} color={color} />;
          } else if (route.name === "Search") {
            icon = <FontAwesome5 name="search" size={size} color={color} />;
          } else if (route.name === "Cate") {
            icon = <Ionicons name="grid-outline" size={size} color={color} />;
          }

          return (
            <View style={styles.tabIconContainer}>
              {icon}
              <Text style={styles.tabLabel} numberOfLines={1} adjustsFontSizeToFit>
                {route.name}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cate" component={CategoryScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
};

// 🔥 Drawer Navigation
const AppNavigator = () => {
  return (
    <ApiProvider>
      <Drawer.Navigator
        initialRouteName="BottomTabs"
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="BottomTabs" component={BottomTabs} options={{ title: "Home" }} />
      </Drawer.Navigator>
    </ApiProvider>
  );
};

export default AppNavigator;

// 📌 Styles
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 15,
    right: 15,
    backgroundColor: "#000317",
    height: 65,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 15,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
    color: "#aaa",
  },
});
