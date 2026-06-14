import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/recipe";

const FAVORITES_KEY = "@favorites";

type FavoritesContextType = {
  favorites: Recipe[];
  loading: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (recipe: Recipe) => void;
  reloadFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType>(
  {} as FavoritesContextType,
);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);

      if (data) {
        setFavorites(JSON.parse(data));
      } else {
        setFavorites([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const saveFavorites = async (items: Recipe[]) => {
    setFavorites(items);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  };

  const isFavorite = (id: string) => {
    return favorites.some((r) => r.idMeal === id);
  };

  const toggleFavorite = async (recipe: Recipe) => {
    const exists = favorites.some((r) => r.idMeal === recipe.idMeal);

    let updated: Recipe[];

    if (exists) {
      updated = favorites.filter((r) => r.idMeal !== recipe.idMeal);
    } else {
      updated = [...favorites, recipe];
    }

    await saveFavorites(updated);
  };

  const reloadFavorites = () => {
    loadFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        reloadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
