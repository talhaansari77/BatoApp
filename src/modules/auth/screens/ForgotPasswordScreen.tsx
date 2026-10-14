import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screens/Screen";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { AppHeader } from "../../../shared/ui/molecules/AppHeader";
import { Pressable, StyleSheet, View } from "react-native";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const {t}=useTranslation()
  return (
    <Screen
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title={t("auth.submit")}
          onPress={() => navigation.navigate("OtpVerification")}
        />
      }
    >
      <View style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={styles.iconButton}
      >
        <AppIcon name={isRTL ? "ArrowRight" : "ArrowLeft"} color={theme.colors.primaryDark} />
      </Pressable>

      <AuthCard
        title={t("auth.forgotPassword.title")}
        subtitle={t("auth.forgotPassword.subtitle")}
      >
        <AppInput
          label={t("auth.forgotPassword.phoneLabel")}
          placeholder={t("auth.forgotPassword.phonePlaceholder")}
          autoCapitalize="none"
          keyboardType="number-pad"
          leftIcon="Phone"
        />
      </AuthCard>
      </View>
    </Screen>
  );
}

const styles=StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20
  }
})
