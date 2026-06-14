import React from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";
import { Recipe } from "../types/recipe";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";
import { toggleFavorite, isFavorite } from "../storage/favoritesStorage";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

export default function RecipeCard({ recipe, onPress }: Props) {
  const { theme } = useTheme();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [recipe.idMeal]);

  const checkFavorite = async () => {
    const result = await isFavorite(recipe.idMeal);

    setFavorite(result);
  };

  const handleFavorite = async () => {
    await toggleFavorite(recipe);

    setFavorite((prev) => !prev);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      <Image
        source={{
          uri: recipe.strMealThumb,
        }}
        style={styles.image}
      />

      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={28}
          color={favorite ? "#FF5252" : "#FFFFFF"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          {recipe.strMeal}
        </Text>

        <Text style={[styles.category, { color: theme.secondaryText }]}>
          {recipe.strCategory}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 220,
  },

  content: {
    padding: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  category: {
    marginTop: 6,
    color: "#777",
  },

  favoriteButton: {
    position: "absolute",

    top: 12,
    right: 12,

    backgroundColor: "rgba(0,0,0,0.25)",

    width: 40,
    height: 40,

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 100,
  },
});
