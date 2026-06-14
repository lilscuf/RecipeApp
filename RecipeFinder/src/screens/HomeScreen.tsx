import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { searchRecipes, getRecipesByCategory } from "../api/recipesApi";
import { Recipe } from "../types/recipe";
import RecipeCard from "../components/RecipeCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import CategoryFilter from "../components/CategoryFilter";
import SkeletonCard from "../components/SkeletonCard";

type Props = NativeStackScreenProps<RootStackParamList, any>;

export default function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme, darkMode, toggleTheme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");


  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const loadDefaultRecipes = async () => {
    setLoading(true);

    try {
      const categories = ["Chicken", "Beef", "Seafood", "Dessert"];

      const responses = await Promise.all(
        categories.map((category) => getRecipesByCategory(category)),
      );

      const merged = responses.flat();

      const unique = merged.filter(
        (recipe, index, array) =>
          index === array.findIndex((r) => r.idMeal === recipe.idMeal),
      );

      setRecipes(unique);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [debouncedQuery]);

  useEffect(() => {
    loadDefaultRecipes();
  }, []);

  const loadRecipes = async () => {
    if (debouncedQuery.trim()) {
      setSelectedCategory("All");
    }
    if (!debouncedQuery.trim()) {
      loadDefaultRecipes();
      return;
    }

    setLoading(true);

    try {
      const data = await searchRecipes(debouncedQuery);

      setRecipes(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <View>
          {[1, 2, 3].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <LinearGradient
                colors={["#ffffff17", "#00000017"]}
                style={styles.header}
              >
                <View style={styles.headerText}>
                  <Text
                    style={[
                      styles.headerTitle,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    🍽 Recipe Finder
                  </Text>

                  <Text
                    style={[
                      styles.headerSubtitle,
                      {
                        color: theme.secondaryText,
                      },
                    ]}
                  >
                    Discover delicious recipes
                  </Text>
                </View>

                <TouchableOpacity onPress={toggleTheme}>
                  <Ionicons
                    name={darkMode ? "moon" : "sunny"}
                    size={32}
                    color={darkMode ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </LinearGradient>

              <View
                style={[
                  styles.searchContainer,
                  {
                    backgroundColor: theme.card,
                  },
                ]}
              >
                <Ionicons name="search" size={20} color="#999" />

                <TextInput
                  placeholder="Search recipes..."
                  value={query}
                  onChangeText={setQuery}
                  style={[
                    styles.input,
                    {
                      color: theme.text,
                    },
                  ]}
                />

                {query.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setQuery("");

                      loadDefaultRecipes();
                    }}
                  >
                    <Ionicons name="close-circle" size={22} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              <CategoryFilter
                selected={selectedCategory}
                onSelect={async (category) => {
                  setSelectedCategory(category);

                  if (category === "All") {
                    await loadDefaultRecipes();

                    return;
                  }

                  setLoading(true);

                  try {
                    const data = await getRecipesByCategory(category);

                    setRecipes(data);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          key={refreshKey}
          data={recipes}
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,

    marginBottom: 15,
  },

  searchIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  clearButton: {
    position: "absolute",
    right: 14,
    top: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 20,

    borderRadius: 24,

    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#666",
    marginTop: 4,
  },

  sortContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },

  headerText: {
    flex: 1,
  },
});
