import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native"; // ✅ Import Lottie
import { useApi } from "@/context/ApiContext";
import SmallProductCard from "../components/SmallProductCard";
import { MenuItem } from "@/types/types";

const SearchScreen: React.FC = () => {
  const { menu } = useApi(); // Fetch menu items from context
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menu);

  // Function to filter menu items
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredItems(menu);
    } else {
      const filtered = menu.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search for dishes..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Display Results or Show Animation if No Items Found */}
      {filteredItems.length === 0 ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require("@/assets/lottie/not-found.json")} // ✅ Add animation file
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.noResults}>No items found 😞</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          numColumns={2} // ✅ 2 cards per row
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <SmallProductCard {...item} />}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  noResults: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
