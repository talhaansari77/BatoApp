import React from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { ClinicService } from "../services/servicesApi";

type ServiceCardProps = {
  service: ClinicService;
  onPress?: (service: ClinicService) => void;
};

export const ServiceCard = React.memo(function ServiceCard({
  service,
  onPress,
}: ServiceCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => onPress?.(service)}
      style={{
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.card,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppIcon name="Sparkles" size={24} color={theme.colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            {service.name}
          </Text>

          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: 13,
              marginBottom: theme.spacing.sm,
            }}
            numberOfLines={2}
          >
            {service.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <AppIcon
                name="Clock3"
                size={14}
                color={theme.colors.textMuted}
              />

              <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                {service.durationMinutes} min
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <AppIcon
                name="BadgeDollarSign"
                size={14}
                color={theme.colors.textMuted}
              />

              <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                {service.price} KWD
              </Text>
            </View>
          </View>
        </View>

        <AppIcon
          name="ChevronRight"
          size={20}
          color={theme.colors.textMuted}
        />
      </View>
    </Pressable>
  );
});