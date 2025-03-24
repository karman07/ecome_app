import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice"; // ✅ Import clearCart action
import { RootStackParamList } from "@/types/types";

const ThankYouScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();  

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* ✅ Lottie Animation */}
      <LottieView
        source={require("@/assets/lottie/thankyou.json")} // Replace with your actual Lottie file
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      <Text style={styles.thankYouText}>Thank You for Your Order!</Text>
      <Text style={styles.subText}>Your order has been placed successfully.</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text style={styles.homeText}>{"<-"} Go back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  lottie: { width: 200, height: 200 }, // Adjust the size of the animation
  thankYouText: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#FF5555" },
  subText: { fontSize: 16, color: "#666", textAlign: "center", marginVertical: 10 },
  homeText: { fontSize: 18, color: "#6594dc", marginTop: 20 },
});
