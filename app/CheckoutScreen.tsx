import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../context/ApiContext";
import axios from "axios";
import { BASE_URL } from "@/Base/base";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/types";

const RAZORPAY_KEY_ID = "rzp_test_TJOrQglqT6B38A";
type NavigationProps = StackNavigationProp<RootStackParamList, "Main">;
const CheckoutScreen = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [table, setTable] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline">("online");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const [paymentUrl, setPaymentUrl] = useState("");
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const { menu } = useApi();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // ✅ Calculate total price
  const totalPrice = cartItems.reduce((total, cartItem) => {
    const menuItem = menu.find((item) => item._id === cartItem.productId);
    return total + (menuItem ? menuItem.price * cartItem.quantity : 0);
  }, 0);

  const handleConfirmOrder = async () => {
    if (!customerName || !customerNumber || !table) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const orderData = {
      customerName,
      customerEmail,
      customerNumber,
      menuItems: cartItems.map((item) => ({
        menuItemId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice,
      table,
      paymentStatus: paymentMethod === "online" ? "pending" : "completed",
      paymentMethod: paymentMethod === "online" ? "Online" : "COD",
      location,
    };

    if (paymentMethod === "online") {
      initiateRazorpayPayment(orderData);
    } else {
      try {
        await axios.post(`${BASE_URL}/orders`, orderData);
        dispatch(clearCart());
      //  Alert.alert("Success", "Order placed successfully!");
        navigation.navigate("ThankYou");
      } catch (error) {
        Alert.alert("Error", "Failed to place order.");
      }
    }
  };

  const initiateRazorpayPayment = async (orderData: any) => {
    try {
      // ✅ Generate Razorpay Order ID from backend
      const response = await axios.post(`${BASE_URL}/payment/create-order`, { amount: totalPrice * 100 });
      
      if (response.data?.paymentUrl) {
        setPaymentUrl(`https://api.razorpay.com/v1/checkout/embedded?key_id=${RAZORPAY_KEY_ID}&amount=${totalPrice * 100}&currency=INR&prefill[name]=${name}&prefill[contact]=${customerNumber}&notes[merchant_name]=Fresh Farm&redirect=true`);
        setIsWebViewVisible(true);
      } else {
        setPaymentUrl(`https://api.razorpay.com/v1/checkout/embedded?key_id=${RAZORPAY_KEY_ID}&amount=${totalPrice * 100}&currency=INR&prefill[name]=${customerName}&prefill[contact]=${customerNumber}&notes[merchant_name]=Fresh Farm&redirect=true`);
        setIsWebViewVisible(true);
      }
    } catch (error) {
      Alert.alert("Payment Error", "Could not start payment.");
      console.log(error)
    }
  };

  const handleWebViewNavigation = async (event: any) => {
    if (event.url.includes("authorized")) {
      setIsWebViewVisible(false);
      dispatch(clearCart());
      Alert.alert("Success", "Payment Successful! Order placed.");
     navigation.navigate("ThankYou");
     navigation.navigate("Main")
    } else if (event.url.includes("failed")) {
      setIsWebViewVisible(false);
      Alert.alert("Error", "Payment Failed! Try again.");
    }
    console.log()
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <TextInput style={styles.input} placeholder="Name" value={customerName} onChangeText={setCustomerName} />
        <TextInput style={styles.input} placeholder="Email (Optional)" value={customerEmail} onChangeText={setCustomerEmail} />
        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={customerNumber} onChangeText={setCustomerNumber} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Table Number</Text>
        <TextInput style={styles.input} placeholder="Enter Table Number" keyboardType="numeric" value={table} onChangeText={setTable} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity style={[styles.paymentButton, paymentMethod === "online" && styles.activePayment]} onPress={() => setPaymentMethod("online")}>
          <Text style={[styles.paymentText, paymentMethod === "online" && styles.activeText]}>Online Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.paymentButton, paymentMethod === "offline" && styles.activePayment]} onPress={() => setPaymentMethod("offline")}>
          <Text style={[styles.paymentText, paymentMethod === "offline" && styles.activeText]}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.orderText}>Total Items: {cartItems.length} | Total Price: ₹{totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>

      {/* 🔹 WebView Modal for Payment */}
      <Modal visible={isWebViewVisible} animationType="slide">
        <WebView source={{ uri: paymentUrl }} onNavigationStateChange={handleWebViewNavigation} />
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsWebViewVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 20 },
  section: { marginBottom: 20, backgroundColor: "#fff", padding: 15, borderRadius: 10, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 10 },
  paymentButton: { padding: 12, borderWidth: 1, borderColor: "#FF5555", borderRadius: 8, marginBottom: 10, alignItems: "center" },
  activePayment: { backgroundColor: "#FF5555" },
  paymentText: { fontWeight: "bold", color: "#FF5555" },
  activeText: { color: "#fff" },
  orderText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  confirmButton: { backgroundColor: "#FF5555", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  confirmButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  closeButton: { padding: 15, backgroundColor: "#FF5555", alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16 },
});

export default CheckoutScreen;
