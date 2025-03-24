import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useApi } from "@/context/ApiContext";
import { RootStackParamList } from "@/types/types";

type NavigationProps = StackNavigationProp<RootStackParamList, "CategoryItems">;

const CategoryTabs: React.FC = () => {
  const { categories, loading } = useApi();
  const navigation = useNavigation<NavigationProps>();
  const [selected, setSelected] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; 
  const scaleAnim = useState(new Animated.Value(1))[0]; 

  useEffect(() => {
    if (categories.length > 0) {
      setSelected(categories[0].name);
      fadeIn();
    }
  }, [categories]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelected(categoryName);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => navigation.navigate("CategoryItems", { crusine: categoryName }));
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container} contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="small" color="#FF5555" />
      ) : categories.length === 0 ? (
        <Text style={styles.errorText}>No categories available</Text>
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flexDirection: "row" }}>
          {categories.map((category) => (
            <Animated.View key={category._id} style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity style={styles.tab} onPress={() => handleCategoryPress(category.name)}>
                <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} resizeMode="cover" />
                <Text style={styles.text}>{category.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default CategoryTabs;

const styles = StyleSheet.create({
  container: { marginTop: 15, paddingHorizontal: 10, paddingVertical: 15 },
  tab: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: { fontSize: 14, fontWeight: "bold", color: "#444", marginTop: 5 },
  categoryImage: { width: 50, height: 50, borderRadius: 25 },
  errorText: { color: "red", fontSize: 14, textAlign: "center" },
});
