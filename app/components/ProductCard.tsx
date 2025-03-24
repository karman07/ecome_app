import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { toggleFavorite } from "@/store/favoriteSlice";
import { MenuItem, RootStackParamList } from "@/types/types";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationProps = StackNavigationProp<RootStackParamList, "ProductDetail">;
const ProductCard: React.FC<MenuItem> = ({ _id, name, imageUrl, price, description }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>(); 

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.productId === _id)
  );
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);

  const [isFavorite, setIsFavorite] = useState(favoriteItems.includes(_id));
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);

  useEffect(() => {
    setIsFavorite(favoriteItems.includes(_id));
  }, [favoriteItems]);

  useEffect(() => {
    setQuantity(cartItem?.quantity || 0);
  }, [cartItem]);

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(_id));
  };

  const handlePress = () => {
    navigation.navigate("ProductDetail", {
      productId: _id
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity onPress={handleFavoriteToggle} style={styles.heartIcon}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color="#FF5555" />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${price}</Text>
          <View style={styles.actions}>
            {quantity > 0 ? (
              <>
                <TouchableOpacity 
                  onPress={() => dispatch(removeFromCart({ productId: _id }))} 
                  style={styles.iconButton}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="#FF5555" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => dispatch(addToCart({ productId: _id }))} 
                  style={styles.iconButton}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#FF5555" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.cartButton} 
                onPress={() => dispatch(addToCart({ productId: _id }))}
              >
                <Ionicons name="cart" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 14,
    marginRight: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    borderRadius: 50,
    padding: 6,
  },
  info: {
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5555",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "transparent",
    marginHorizontal: 5,
    padding: 5,
  },
  cartButton: {
    backgroundColor: "#FF5555",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#FF5555",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  quantity: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 5,
  },
});
