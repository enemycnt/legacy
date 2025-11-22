import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import type { ChakraProviderProps } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      backgroundColor: "#f5f7fb",
      color: "#0f172a",
      fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#edf8ff" },
          100: { value: "#d4e8ff" },
          200: { value: "#a8d1ff" },
          300: { value: "#7ab8ff" },
          400: { value: "#4d9dff" },
          500: { value: "#2b7ee6" },
          600: { value: "#1e62b4" },
          700: { value: "#154a8c" },
          800: { value: "#0c305d" },
          900: { value: "#041a36" },
        },
        surface: {
          subtle: { value: "#f5f7fb" },
        },
        accent: {
          muted: { value: "#e9edf5" },
        },
      },
      shadows: {
        card: { value: "0 20px 60px rgba(16, 24, 40, 0.08)" },
      },
      radii: {
        xl: { value: "1.25rem" },
      },
    },
    recipes: {
      button: {
        base: {
          fontWeight: "600",
          borderRadius: "lg",
        },
        defaultVariants: {
          colorPalette: "blue",
        },
      },
    },
  },
});

const theme: ChakraProviderProps["value"] = createSystem(defaultConfig, config);

export default theme;
