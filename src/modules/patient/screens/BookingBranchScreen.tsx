import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { PatientStackParamList } from "../../../core/navigation/navigation.types";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { BookingStepIndicator } from "../components";

type NavigationProp = NativeStackNavigationProp<
  PatientStackParamList,
  "BookingBranch"
>;

type Branch = {
  id: string;
  name: string;
  address: string;
  distance: string;
  availability: string;
};

const branches: Branch[] = [
  {
    id: "main",
    name: "Main Branch",
    address: "Salmiya, Kuwait",
    distance: "3.2 km away",
    availability: "Available today",
  },
  {
    id: "avenues",
    name: "Avenues Branch",
    address: "Avenues Mall, Kuwait",
    distance: "8.5 km away",
    availability: "Available tomorrow",
  },
  {
    id: "farwaniya",
    name: "Farwaniya Branch",
    address: "Farwaniya, Kuwait",
    distance: "11.4 km away",
    availability: "Next available Jun 24",
  },
];

export function BookingBranchScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);

  return (
    <Screen title="Select Branch" subtitle="Booking step 1 of 4" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="MapPinned"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2">Choose clinic branch</AppText>

            <AppText color={theme.colors.textMuted}>
              Select the clinic location where you want to attend your treatment
              session.
            </AppText>
          </View>
        </View>

        <BookingStepIndicator currentStep="branch" />

        <View style={styles.section}>
          <AppText variant="h3">Available Branches</AppText>

          <View style={styles.list}>
            {branches.map((branch) => {
              const selected = selectedBranchId === branch.id;

              return (
                <Pressable
                  key={branch.id}
                  onPress={() => setSelectedBranchId(branch.id)}
                  style={({ pressed }) => [
                    styles.branchCard,
                    selected && styles.branchCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.branchTop}>
                    <View style={styles.branchIcon}>
                      <AppIcon
                        name="Building2"
                        size={24}
                        color={theme.colors.primaryDark}
                      />
                    </View>

                    <View style={styles.branchText}>
                      <AppText variant="bodyMedium">{branch.name}</AppText>

                      <AppText variant="caption" color={theme.colors.textMuted}>
                        {branch.address}
                      </AppText>
                    </View>

                    <View style={selected ? styles.radioActive : styles.radio}>
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                  </View>

                  <View style={styles.branchMeta}>
                    <View style={styles.metaItem}>
                      <AppIcon
                        name="Navigation"
                        size={16}
                        color={theme.colors.textMuted}
                      />

                      <AppText variant="caption" color={theme.colors.textMuted}>
                        {branch.distance}
                      </AppText>
                    </View>

                    <View style={styles.metaItem}>
                      <AppIcon
                        name="CalendarCheck"
                        size={16}
                        color={theme.colors.successText}
                      />

                      <AppText variant="caption" color={theme.colors.textMuted}>
                        {branch.availability}
                      </AppText>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <AppButton
          title="Continue to Date & Time"
          onPress={() => navigation.navigate("BookingDateTime")}
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroCard: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: "row",
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    list: {
      gap: theme.spacing.md,
    },

    branchCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    branchCardActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.nude,
    },

    branchTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    branchIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    branchText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    radio: {
      width: 24,
      height: 24,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    radioActive: {
      width: 24,
      height: 24,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.primaryDark,
      alignItems: "center",
      justifyContent: "center",
    },

    radioDot: {
      width: 12,
      height: 12,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    branchMeta: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
  });
}
