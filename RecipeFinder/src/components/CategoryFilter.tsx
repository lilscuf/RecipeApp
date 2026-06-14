import React from "react";

import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  selected: string;

  onSelect: (category: string) => void;
}

const categories = ["All", "Beef", "Chicken", "Seafood", "Dessert"];

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.button, selected === category && styles.active]}
          onPress={() => onSelect(category)}
        >
          <Text
            numberOfLines={1}
            style={[styles.text, selected === category && styles.activeText]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 4,

    paddingBottom: 10,
  },

  button: {
    minWidth: 90,

    height: 42,

    paddingHorizontal: 20,

    justifyContent: "center",

    alignItems: "center",

    borderRadius: 21,

    marginRight: 10,

    backgroundColor: "#2A2A2A",
  },

  active: {
    backgroundColor: "#666666",
  },

  text: {
    color: "#FFFFFF",

    fontSize: 17,

    fontWeight: "500",
  },

  activeText: {
    fontWeight: "700",
  },
});
