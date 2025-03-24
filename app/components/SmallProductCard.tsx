import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { toggleFavorite } from "@/store/favoriteSlice";
import { MenuItem } from "@/types/types";

const SmallProductCard: React.FC<MenuItem> = ({ _id, name, imageUrl, price, description }) => {
  const dispatch = useDispatch();
  
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.productId === _id)
  );
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);
  
  const [isFavorite, setIsFavorite] = useState(favoriteItems.includes(_id));

  useEffect(() => {
    setIsFavorite(favoriteItems.includes(_id));
  }, [favoriteItems]);

  const quantity = cartItem?.quantity || 0;

  return (
    <View style={styles.card}>
      {/* Product Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />

      {/* Favorite (Heart) Button */}
      <TouchableOpacity onPress={() => dispatch(toggleFavorite(_id))} style={styles.heartIcon}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color="#FF5555" />
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <Text style={styles.price}>${price}</Text>

        {/* Cart Actions */}
        {quantity > 0 ? (
          <View style={styles.actions}>
            {/* Remove from Cart */}
            <TouchableOpacity 
              onPress={() => dispatch(removeFromCart({ productId: _id }))}
              style={styles.iconButton}
            >
              <Ionicons name="remove-circle-outline" size={22} color="#FF5555" />
            </TouchableOpacity>

            {/* Quantity Display */}
            <Text style={styles.quantity}>{quantity}</Text>

            {/* Add to Cart */}
            <TouchableOpacity 
              onPress={() => dispatch(addToCart({ productId: _id }))}
              style={styles.iconButton}
            >
              <Ionicons name="add-circle-outline" size={22} color="#FF5555" />
            </TouchableOpacity>
          </View>
        ) : (
          /* Add to Cart Button */
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={() => dispatch(addToCart({ productId: _id }))}
          >
            <Ionicons name="cart" size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SmallProductCard;

const styles = StyleSheet.create({
  card: {
    width: "47%", // Fits 2 per row with spacing
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    borderRadius: 50,
    padding: 5,
  },
  info: {
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flexShrink: 1,
  },
  description: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginVertical: 5,
    flexShrink: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF5555",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  iconButton: {
    backgroundColor: "transparent",
    marginHorizontal: 5,
    padding: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 5,
  },
  cartButton: {
    backgroundColor: "#FF5555",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "center",
  },
});
