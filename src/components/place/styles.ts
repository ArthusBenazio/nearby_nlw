import { colors, fontFamily } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    height: 120,
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  image: {
    width: 116,    
    height: 104,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    color: colors.gray[600],
    fontFamily: fontFamily.medium,
  },
  description: {
    fontSize: 12,
    color: colors.gray[500],
    fontFamily: fontFamily.medium,
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  tickets: {
    fontSize: 12,
    color: colors.gray[400],
    fontFamily: fontFamily.regular,
  },
});
