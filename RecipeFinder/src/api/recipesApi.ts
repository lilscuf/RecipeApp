import axios from "axios";

const api = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
});

export const searchRecipes = async (query: string) => {
  const response = await api.get(`/search.php?s=${query}`);

  return response.data.meals || [];
};

export const getRecipeById = async (id: string) => {
  const response = await api.get(`/lookup.php?i=${id}`);

  return response.data.meals[0];
};

export const getRecipesByCategory = async (category: string) => {
  const response = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );

  const meals = response.data.meals || [];

  return meals.map((meal: any) => ({
    ...meal,

    strCategory: category,
  }));
};

