import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { toggleFavorite } from "@/store/favoriteSlice";
import { RootState } from "@/store/store";
import { useApi } from "@/context/ApiContext";
import ProductCard from "./components/ProductCard"; // Importing ProductCard component
import LottieView from "lottie-react-native";

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { productId } = route.params as { productId: string };
  const { menu, loading } = useApi();
  const product = menu.find((item) => item._id === productId);

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.productId === productId)
  );
  const isFavorite = useSelector((state: RootState) =>
    state.favorites.items.includes(productId)
  );

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d9534f" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  // 🔥 Filtering similar products based on category
  const similarProducts = menu.filter(
    (item) => item.crusine === product.crusine && item._id !== productId
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => dispatch(toggleFavorite(productId))}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? "#FF5555" : "#FF5555"}
          />
        </TouchableOpacity>
      </View>

      {/* 🔥 Product Image */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      </Animated.View>

      {/* 🔥 Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text
          style={product.available ? styles.available : styles.notAvailable}
        >
          {product.available ? "Available" : "Out of Stock"}
        </Text>
        <Text style={styles.categoryText}>Category: {product.crusine}</Text>
        <Text style={styles.weightCalories}>
          {product.weight} - {product.calories} Calories
        </Text>

        {/* 🔥 Separator Line */}
        <View style={styles.separator} />

        <Text style={styles.description}>{product.description}</Text>

        {/* 🔥 Quantity Selector */}
        {cartItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.semiRoundedButton}
              onPress={() => dispatch(removeFromCart({ productId }))}
            >
              <Ionicons name="remove" size={14} color="#FF5555" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{cartItem.quantity}</Text>

            <TouchableOpacity
              style={styles.semiRoundedButton}
              onPress={() => dispatch(addToCart({ productId }))}
            >
              <Ionicons name="add" size={14} color="#FF5555" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => dispatch(addToCart({ productId }))}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      {similarProducts.length > 0 ? (
        <View style={styles.similarProductsContainer}>
          <Text style={styles.similarProductsTitle}>Similar Products</Text>
          <View style={styles.separator} />
          <FlatList
            data={similarProducts}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Animated.View style={{ opacity: fadeAnim }}>
                <ProductCard {...item} />
              </Animated.View>
            )}
          />
        </View>
      ) : (
        <View style={styles.centered}>
          <LottieView
            source={require("@/assets/lottie/not-found.json")} // Add your Lottie JSON file in assets
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.noProductsText}>No similar products found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProductScreen;

// 📌 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#000317",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  available: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginVertical: 5,
  },
  notAvailable: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginVertical: 5,
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
  weightCalories: {
    fontSize: 16,
    color: "#000",
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    color: "#000",
    marginVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  addToCartButton: {
    backgroundColor: "#FF5555",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  semiRoundedButton: {
    width: 40,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF5555",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  similarProductsContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  similarProductsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  noProductsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    marginTop: 10,
  }
});
