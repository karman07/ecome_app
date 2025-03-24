import { View, Text, Image, StyleSheet } from "react-native";

const DealsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deals for Days</Text>
      <Image source={require("../../assets/pic/details.webp")} style={styles.image} />
    </View>
  );
};

export default DealsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "cover" 
  },
});
