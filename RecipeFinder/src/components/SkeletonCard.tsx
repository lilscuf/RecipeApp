import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SkeletonCard() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
        },
      ]}
    >
      <View
        style={[
          styles.image,
          {
            backgroundColor: theme.border,
          },
        ]}
      />

      <View style={styles.content}>
        <View
          style={[
            styles.title,
            {
              backgroundColor: theme.border,
            },
          ]}
        />

        <View
          style={[
            styles.subtitle,
            {
              backgroundColor: theme.border,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,

    overflow: "hidden",

    marginBottom: 20,
  },

  image: {
    height: 220,
  },

  content: {
    padding: 16,
  },

  title: {
    height: 20,

    borderRadius: 10,

    marginBottom: 10,
  },

  subtitle: {
    width: "45%",

    height: 14,

    borderRadius: 8,
  },
});
