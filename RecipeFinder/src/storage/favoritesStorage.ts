import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/recipe";

const FAVORITES_KEY = "@favorites";

export const getFavorites = async (): Promise<
  Recipe[]
> => {
  const data = await AsyncStorage.getItem(
    FAVORITES_KEY
  );

  return data ? JSON.parse(data) : [];
};

export const saveFavorites = async (
  favorites: Recipe[]
) => {
  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  );
};

export const isFavorite = async (
  recipeId: string
) => {
  const favorites = await getFavorites();

  return favorites.some(
    recipe =>
      recipe.idMeal === recipeId
  );
};

export const toggleFavorite = async (
  recipe: Recipe
) => {
  const favorites =
    await getFavorites();

  const exists = favorites.some(
    item =>
      item.idMeal === recipe.idMeal
  );

  let updated: Recipe[];

  if (exists) {
    updated = favorites.filter(
      item =>
        item.idMeal !== recipe.idMeal
    );
  } else {
    updated = [...favorites, recipe];
  }

  await saveFavorites(updated);

  return updated;
};