import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoriteState {
  items: string[];
}

const initialState: FavoriteState = {
  items: [],
};

const loadFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Error loading favorites from storage:", error);
    return [];
  }
};

loadFavorites().then((favorites) => {
  initialState.items = favorites;
});

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (state.items.includes(productId)) {
        state.items = state.items.filter((id) => id !== productId);
      } else {
        state.items.push(productId);
      }
      AsyncStorage.setItem("favorites", JSON.stringify(state.items));
    },

    loadFavoritesFromStorage: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, loadFavoritesFromStorage } = favoriteSlice.actions;
export default favoriteSlice.reducer;
