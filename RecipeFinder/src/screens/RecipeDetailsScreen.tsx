import React, { useEffect, useState } from "react";

import {
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { getRecipeById } from "../api/recipesApi";
import { Recipe } from "../types/recipe";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toggleFavorite, isFavorite } from "../storage/favoritesStorage";
import { useTheme } from "../context/ThemeContext";

type Props = {
  route: RouteProp<RootStackParamList, "Details">;
};

export default function RecipeDetailsScreen({ route }: Props) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    loadRecipe();
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const result = await isFavorite(recipeId);

    setFavorite(result);
  };

  const handleFavorite = async () => {
    if (!recipe) return;

    await toggleFavorite(recipe);

    setFavorite((prev) => !prev);
  };

  const loadRecipe = async () => {
    try {
      const data = await getRecipeById(recipeId);

      setRecipe(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{
          marginTop: 40,
        }}
      />
    );
  }

  if (!recipe) return null;

  return (
    <ScrollView>
      <Image
        source={{
          uri: recipe.strMealThumb,
        }}
        style={styles.image}
      />

      <View style={[styles.content, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={handleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={32}
            color="tomato"
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          {recipe.strMeal}
        </Text>

        <Text style={[styles.category, { color: theme.secondaryText }]}>
          {recipe.strCategory}
        </Text>

        <Text style={[styles.instructions, { color: theme.text }]}>
          {recipe.strInstructions}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 320,
  },

  content: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  category: {
    color: "#666",
    marginBottom: 20,
  },

  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },

  favoriteButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});
