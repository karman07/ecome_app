import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useApi } from "../../context/ApiContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CustomDrawer = ({ navigation }: any) => {
  const { categories, loading } = useApi();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  // Get favorite items count from Redux
  const favoriteCount = useSelector((state: RootState) => state.favorites.items.length);

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Hi, Welcome to {"\n\t\t"} DevSphere</Text>
      </View>

      <ScrollView>
        {/* Home */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("BottomTabs", { screen: "Home" })}>
          <MaterialIcons name="home" size={22} color="#333" style={styles.icon} />
          <Text style={styles.drawerText}>Home</Text>
        </TouchableOpacity>

        {/* Search */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("BottomTabs", { screen: "Search" })}>
          <MaterialIcons name="search" size={22} color="#333" style={styles.icon} />
          <Text style={styles.drawerText}>Search</Text>
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("BottomTabs", { screen: "Cart" })}>
          <MaterialIcons name="shopping-cart" size={22} color="#333" style={styles.icon} />
          <Text style={styles.drawerText}>Cart</Text>
        </TouchableOpacity>

        {/* Favorites */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("FavoritesScreen")}>
          <Ionicons name="heart" size={22} color="#FF5555" style={styles.icon} />
          <Text style={styles.drawerText}>Favorites ({favoriteCount})</Text>
        </TouchableOpacity>

        {/* Categories (Dropdown) */}
        <TouchableOpacity style={styles.categoryHeader} onPress={() => setIsCategoryOpen(!isCategoryOpen)}>
          <View style={styles.categoryRow}>
            <MaterialIcons name="category" size={22} color="#000" style={styles.icon} />
            <Text style={styles.categoryTitle}>Categories</Text>
          </View>
          <Ionicons name={isCategoryOpen ? "chevron-up" : "chevron-down"} size={18} color="#000" />
        </TouchableOpacity>

        {isCategoryOpen &&
          (loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate("CategoryItems", { crusine: category.name })}
              >
                <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
                <Text style={styles.drawerText}>{category.name}</Text>
              </TouchableOpacity>
            ))
          ))}
      </ScrollView>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: "#000317",
    alignItems: "center",
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#ffffff",
  },
  drawerText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#ffffff",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 15,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  icon: {
    marginRight: 10,
  },
});
