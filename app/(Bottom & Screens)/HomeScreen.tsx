import React from "react";
import { 
  View, ScrollView, StyleSheet, Text, FlatList, ActivityIndicator, TouchableOpacity 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from "lottie-react-native"; // Import Lottie
import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import DealsSection from "../components/DealsSection";
import ProductCard from "../components/ProductCard";
import { useApi } from "../../context/ApiContext"; 
import TopNavBar from "../components/TopNavBar";
import { RootStackParamList } from "@/types/types";

const HomeScreen: React.FC = () => {
  const { menu, categories, loading } = useApi(); 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  if (loading) {
    return <ActivityIndicator size="large" color="#FF5555" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <TopNavBar/>
      <Header />
      <CategoryTabs />
      <DealsSection />

      {categories.map((category) => {
        const categoryProducts = menu.filter(
          (item) => item.crusine?.toLowerCase() === category.name?.toLowerCase()
        );

        return (
          <View key={category._id} style={styles.categoryContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>{category.name}</Text>
              {categoryProducts.length > 0 && (
                <TouchableOpacity 
                  onPress={() => category.name && navigation.navigate("CategoryItems", { crusine: category.name })}
                >
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {categoryProducts.length > 0 ? (
              <FlatList
                data={categoryProducts}
                renderItem={({ item }) => <ProductCard {...item} />}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.noItemsContainer}>
                <LottieView
                  source={require("../../assets/lottie/not-found.json")} 
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF5555",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  noItemsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
