import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/types";

const Header: React.FC = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let message = "Hello!";
    if (hour < 12) {
      message = "Good Morning, Customer! ☀️";
    } else if (hour < 18) {
      message = "Good Afternoon, Customer! 🌤️";
    } else {
      message = "Good Evening, Customer! 🌙";
    }

    // ✅ Ensure greeting is reset before animation starts
    setGreeting("");

    let index = 0;
    const interval = setInterval(() => {
      setGreeting((prev) => {
        if (index < message.length) {
          return prev + message[index++];
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSearchPress = () => {
    navigation.navigate("Search"); // Navigate to the search screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Search Bar acting as a button */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Ionicons name="search" size={20} color="#888" />
        <Text style={styles.placeholderText}>Search dishes...</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  placeholderText: {
    marginLeft: 10,
    color: "#888",
    fontSize: 16,
  },
});
