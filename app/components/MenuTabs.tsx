import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  View,
} from "react-native";
import { useApi } from "../../context/ApiContext";

interface MenuTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const MenuTabs: React.FC<MenuTabsProps> = ({ selectedCategory, onSelectCategory }) => {
  const { categories } = useApi();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.length === 0 ? (
          <Text style={styles.errorText}>No categories available</Text>
        ) : (
          categories.map((category) => {
            const isSelected = category.name === selectedCategory;
            return (
              <Animated.View key={category._id} style={[styles.tabContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity
                  style={[styles.tab, isSelected && styles.selectedTab]}
                  onPress={() => onSelectCategory(category.name)}
                >
                  <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} />
                  <Text style={[styles.text, isSelected && styles.selectedText]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default MenuTabs;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tabContainer: {
    marginRight: 10,
  },
  tab: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTab: {
    backgroundColor: "#FF5555",
    shadowOpacity: 0.2,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginTop: 5,
  },
  selectedText: {
    color: "#FFF",
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
});
