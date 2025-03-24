import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { useApi } from "@/context/ApiContext";

const CategoryScreen = ({ navigation }: any) => {
  const { categories, loading } = useApi();
  const [typedText, setTypedText] = useState("");
  const originalText = "Explore Categories";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= originalText.length) {
        setTypedText(originalText.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{typedText}</Text>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate("CategoryItems", { crusine: item.name })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// 📌 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default CategoryScreen;
