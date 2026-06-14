import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites } from "../storage/favoritesStorage";
import { Recipe } from "../types/recipe";
import RecipeCard from "../components/RecipeCard";
import { useTheme } from "../context/ThemeContext";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const loadFavorites = async () => {
    const data = await getFavorites();

    setFavorites(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() =>
              navigation.navigate("Details", {
                recipeId: item.idMeal,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.text }]}>
            No favorite recipes yet
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
