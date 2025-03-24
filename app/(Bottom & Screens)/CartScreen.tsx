import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { useApi } from "@/context/ApiContext";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/types";
import { StackNavigationProp } from "@react-navigation/stack";

const GST_RATE = 0.18; // 18% GST
const DELIVERY_CHARGE = 50; // ₹50 default delivery charge

type NavigationProps = StackNavigationProp<RootStackParamList, "CheckoutScreen">;
const CartScreen = () => {
  const dispatch = useDispatch();
  const { menu, loading } = useApi();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigation = useNavigation<NavigationProps>();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Get product details using `_id`
  const cartProducts = cartItems
    .map((cartItem) => {
      const product = menu.find((item) => item._id === cartItem.productId);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subTotal = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  const gstAmount = subTotal * GST_RATE;
  const deliveryCharge = subTotal > 500 ? 0 : DELIVERY_CHARGE;
  const totalAmount = subTotal + gstAmount + deliveryCharge;

  const handleCheckout = () => {
   // setCheckoutSuccess(true);
   navigation.navigate("CheckoutScreen")
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF5555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>


      {/* Cart Items */}
      {!checkoutSuccess && cartProducts.length > 0 ? (
        <FlatList
          data={cartProducts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.description}>
                  {item.description?.length > 60
                    ? item.description.substring(0, 60) + "..."
                    : item.description || "No description available"}
                </Text>
                <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>

                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(removeFromCart({ productId: item._id }))
                    }
                  >
                    <Ionicons name="remove-circle-outline" size={24} color="#FF5555" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(addToCart({ productId: item._id }))}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#FF5555" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remove Item Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => dispatch(removeFromCart({ productId: item._id }))}>
                <Ionicons name="close-circle" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        !checkoutSuccess && (
          <View style={styles.centered}>
            <LottieView
              source={require("@/assets/lottie/cart-empty.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.emptyText}>Your cart is empty!</Text>
          </View>
        )
      )}

      {/* Checkout Section */}
      {!checkoutSuccess && cartProducts.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Text style={styles.centeredText}>Subtotal: ₹{subTotal.toFixed(2)}</Text>
          <Text style={styles.centeredText}>GST (18%): ₹{gstAmount.toFixed(2)}</Text>
          {subTotal > 500 ? (
            <Text style={styles.freeDeliveryText}>🎉 Free Delivery Applied!</Text>
          ) : (
            <Text style={styles.centeredText}>Delivery Charges: ₹{DELIVERY_CHARGE}</Text>
          )}
          <Text style={styles.totalAmount}>Total: ₹{totalAmount.toFixed(2)}</Text>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingBottom: 65,
  },
  header: {
    backgroundColor: "#000317",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 12,
    elevation: 2,
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  price: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center",
  },
  removeButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  checkoutContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  centeredText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  freeDeliveryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginBottom: 5,
  },
  checkoutButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF5555",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  checkoutText: {
    color: "#FF5555",
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
