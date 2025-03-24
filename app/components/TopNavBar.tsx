import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootState } from "@/store/store";

const TopNavBar: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const cartItems = useSelector((state: RootState) => state.cart.items.length);

  return (
    <View style={styles.iconBar}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" size={28} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
        <View style={styles.cartContainer}>
          <Icon name="cart-outline" size={28} color="#333" />
          {cartItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TopNavBar;

const styles = StyleSheet.create({
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    height: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#FF5555",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
