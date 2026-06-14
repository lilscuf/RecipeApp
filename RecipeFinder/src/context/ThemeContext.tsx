import React, { createContext, useContext, useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@theme_mode";

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  theme: ThemeType;
  darkMode: boolean;
  toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);

      if (savedTheme !== null) {
        setDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newValue = !darkMode;

      setDarkMode(newValue);

      await AsyncStorage.setItem(THEME_KEY, newValue ? "dark" : "light");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: darkMode ? darkTheme : lightTheme,

        darkMode,

        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
