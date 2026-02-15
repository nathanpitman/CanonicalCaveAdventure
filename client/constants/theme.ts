import { Platform } from "react-native";

const amberPrimary = "#FF9500";
const amberDark = "#CC7700";
const amberDim = "#664400";

const amberPrimaryLight = "#D97E00";
const amberDarkLight = "#B36A00";
const amberDimLight = "#E8D5B0";

export const Colors = {
  light: {
    text: "#2C2416",
    textSecondary: "#7A6B58",
    textDisabled: "#B0A494",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7A6B58",
    tabIconSelected: amberPrimaryLight,
    link: amberPrimaryLight,
    backgroundRoot: "#F5F0E8",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#EDE6DA",
    backgroundTertiary: "#E0D7C8",
    primary: amberPrimaryLight,
    primaryDark: amberDarkLight,
    primaryDim: amberDimLight,
    danger: "#C62828",
    success: "#2E7D32",
    border: "#D5C9B5",
  },
  dark: {
    text: "#E8DDD0",
    textSecondary: "#A89580",
    textDisabled: "#5A5248",
    buttonText: "#0A0A0A",
    tabIconDefault: "#A89580",
    tabIconSelected: amberPrimary,
    link: amberPrimary,
    backgroundRoot: "#0A0A0A",
    backgroundDefault: "#1A1612",
    backgroundSecondary: "#2A2218",
    backgroundTertiary: "#3A3228",
    primary: amberPrimary,
    primaryDark: amberDark,
    primaryDim: amberDim,
    danger: "#D32F2F",
    success: "#66BB6A",
    border: amberDim,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
