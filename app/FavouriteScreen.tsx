import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MenuItem } from "@/types/types";
import { useApi } from "@/context/ApiContext";
import SmallProductCard from "./components/SmallProductCard";

const FavoritesScreen: React.FC = () => {
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);
  const { menu } = useApi();

  const favoriteMenuItems = menu.filter((item: MenuItem) => favoriteItems.includes(item._id));

  
  const message = "Your Favorite Items 💖";
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    let index = 0;
    setAnimatedText(""); // Reset text
    const interval = setInterval(() => {
      if (index < message.length) {
        setAnimatedText((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust speed

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>

      {favoriteMenuItems.length === 0 ? (
        <Text style={styles.emptyText}>No favorite items yet. ❤️</Text>
      ) : (
        <FlatList
          data={favoriteMenuItems}
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

export default FavoritesScreen;

// 📌 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
