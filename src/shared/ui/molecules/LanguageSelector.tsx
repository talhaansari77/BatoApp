import { Pressable, View } from "react-native";

import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppLanguage } from "../../../core/i18n/i18n";
import { AppIcon } from "../atoms/AppIcon";
import { AppText } from "../atoms/AppText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageButton from "./LanguageButton";
import LanguageToggle from "./LanguageToggle";

export function LanguageSelector({ withToggle = false }) {
  const theme = useAppTheme();
  const { language, setLanguage } = useAppLanguage();

  return (
    <View style={{ gap: theme.spacing.sm, alignItems: "flex-end" }}>
      {withToggle ? (
        <LanguageToggle value={language} onChange={setLanguage} />
      ) : (
        <LanguageButton value={language} onChange={setLanguage} />
      )}
    </View>
  );
}
