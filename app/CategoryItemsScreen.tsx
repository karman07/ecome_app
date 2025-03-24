import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import { useApi } from "../context/ApiContext";
import SmallProductCard from "./components/SmallProductCard";
import MenuTabs from "./components/MenuTabs"; // Updated import

const CategoryItemsScreen = () => {
  const { menu, categories } = useApi();
  const route = useRoute(); // Get the navigation route
  const { crusine } = route.params as { crusine?: string }; // Extract passed category
  const [selectedCategory, setSelectedCategory] = useState(crusine || "");

  useEffect(() => {
    if (crusine) {
      setSelectedCategory(crusine); // Update category if passed from navigation
    } else if (categories.length > 0) {
      setSelectedCategory(categories[0].name); // Default to the first category
    }
  }, [crusine, categories]);

  const filteredProducts = menu.filter(
    (item) => item.crusine?.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <View style={styles.container}>
      <MenuTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      
      {filteredProducts.length === 0 ? (
        <View style={styles.noItemsContainer}>
          <LottieView
            source={require("../assets/lottie/not-found.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.noItemsText}>No items available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <SmallProductCard {...item} />}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default CategoryItemsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  //  paddingTop: 10,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  noItemsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
});
