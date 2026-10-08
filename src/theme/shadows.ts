import { Platform } from "react-native";

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#2B2B2B",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      // elevation: 3,
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    },
  }),
};
