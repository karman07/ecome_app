import React from "react";
import { StatusBar } from "react-native"; // Import StatusBar
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./SplashScreen";
import { RootStackParamList } from "@/types/types";
import { ApiProvider } from "@/context/ApiContext"; 
import { Provider } from "react-redux";
import store from "@/store/store";
import BottomTabs from "./(Bottom & Screens)/BottomTabs";
import CategoryItemsScreen from "./CategoryItemsScreen";
import FavoritesScreen from "./FavouriteScreen";
import ProductScreen from "./ProductScreen";
import CheckoutScreen from "./CheckoutScreen";
import ThankYouScreen from "./ThankyouScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Index: React.FC = () => {
  return (
    <Provider store={store}>
      <ApiProvider>
          <StatusBar backgroundColor="#000317" barStyle="light-content" />

          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#000317" }, 
              headerTintColor: "#fff",
              headerTitleAlign: "center", 
            }}
          >
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Main" 
              component={BottomTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="CategoryItems" 
              component={CategoryItemsScreen} 
              options={{ title: "Menu" }} 
            />
                 <Stack.Screen 
              name="FavoritesScreen" 
              component={FavoritesScreen} 
              options={{ title: "Your Favorites" }} 
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductScreen} 
              options={{ headerShown: false}} 
            />
            <Stack.Screen 
              name="CheckoutScreen" 
              component={CheckoutScreen} 
              options={{ headerShown: false}} 
            />
            <Stack.Screen 
              name="ThankYou" 
              component={ThankYouScreen} 
              options={{ headerShown: false}} 
            />
          </Stack.Navigator>
      </ApiProvider>
    </Provider>
  );
};

export default Index;
