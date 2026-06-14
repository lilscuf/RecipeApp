import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "./BottomTabs";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";

import { RootStackParamList } from "../types/navigation";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { darkMode } = useTheme();

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
          },

          headerTintColor: darkMode ? "#FFFFFF" : "#000000",

          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Details"
          component={RecipeDetailsScreen}
          options={{
            title: "Recipe",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
