import React, { useMemo, useState } from "react";
import { Pressable, SectionList, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// NOTE: adjust this import to wherever your reports stack's ParamList
// actually lives — mirrors the pattern used by AuthStackParamList.
// You'll need to add something like:
//   export type ReportsStackParamList = {
//     MedicalReports: undefined;
//     ReportDetails: { reportId: string };
//   };
import { ReportsStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";

type Props = NativeStackScreenProps<ReportsStackParamList, "MedicalReports">;

type FilterKey = "week" | "month" | "quarter" | "all";

interface MedicalReportSummary {
  id: string;
  doctorName: string;
  date: string;
  tags: string[];
  note?: string;
}

interface ReportSection {
  title: string;
  data: MedicalReportSummary[];
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "all", label: "All Records" },
];

// Placeholder data shaped like the design — swap for your real reports fetch
// (e.g. a query keyed off the logged-in patient's file number).
const MOCK_SECTIONS: ReportSection[] = [
  {
    title: "NOVEMBER 2026",
    data: [
      {
        id: "rep_2026_11_07",
        doctorName: "Basma Gamal",
        date: "7 Nov 2026",
        tags: ["Iron", "Zinc", "+12 more"],
        note: "These lab investigations correspond to 8/7/2026.",
      },
    ],
  },
  {
    title: "JULY 2026",
    data: [
      {
        id: "rep_2026_07_05_a",
        doctorName: "Basma Gamal",
        date: "5 Jul 2026",
        tags: ["Vitamin B12", "Vitamin D"],
      },
      {
        id: "rep_2026_07_05_b",
        doctorName: "Basma Gamal",
        date: "5 Jul 2026",
        tags: ["Vitamin B12"],
      },
    ],
  },
];

export function MedicalReportsScreen({ navigation }: Props) {
  const theme = useAppTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  // Client-side filter over the mock data by doctor/test/date text.
  // Replace with a server-side query param once wired to real data.
  const sections = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_SECTIONS;

    const query = searchTerm.trim().toLowerCase();
    return MOCK_SECTIONS.map((section) => ({
      ...section,
      data: section.data.filter(
        (report) =>
          report.doctorName.toLowerCase().includes(query) ||
          report.date.toLowerCase().includes(query) ||
          report.tags.some((tag) => tag.toLowerCase().includes(query))
      ),
    })).filter((section) => section.data.length > 0);
  }, [searchTerm]);

  const handleOpenReport = (reportId: string) => {
    navigation.navigate("ReportDetails", { reportId });
  };

  return (
    <Screen
      title="Medical Reports"
      subtitle="Review your medical history and diagnostic reports."
    >
      <View style={{ gap: theme.spacing.md }}>
        <AppInput
          placeholder="Search by doctor, test, date, conclusion..."
          leftIcon="Search"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.map((filter) => {
            const isActive = filter.key === activeFilter;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setActiveFilter(filter.key)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: isActive
                    ? theme.colors.primary ?? "#B08968"
                    : theme.colors.cardMuted,
                }}
              >
                <AppText
                  variant="bodyMedium"
                  color={isActive ? "#FFFFFF" : theme.colors.textMuted}
                >
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ gap: theme.spacing.sm, paddingTop: theme.spacing.md }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <AppText
            variant="bodyMedium"
            color={theme.colors.textMuted}
            style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}
          >
            {section.title}
          </AppText>
        )}
        renderItem={({ item }) => (
          <ReportCard report={item} onPress={() => handleOpenReport(item.id)} />
        )}
        ListEmptyComponent={
          <AppText color={theme.colors.textMuted} style={{ marginTop: theme.spacing.lg }}>
            No reports match your search.
          </AppText>
        }
      />
    </Screen>
  );
}

function ReportCard({
  report,
  onPress,
}: {
  report: MedicalReportSummary;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 14,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
      }}
    >
      <View style={{ flex: 1, gap: 6 }}>
        <AppText variant="bodyMedium" color={theme.colors.text}>
          {report.doctorName}
        </AppText>
        <AppText variant="small" color={theme.colors.textMuted}>
          {report.date}
        </AppText>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
          {report.tags.map((tag) => (
            <View
              key={tag}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: theme.colors.cardMuted,
              }}
            >
              <AppText variant="small" color={theme.colors.textMuted}>
                {tag}
              </AppText>
            </View>
          ))}
        </View>

        {report.note ? (
          <AppText variant="small" color={theme.colors.textMuted} style={{ marginTop: 2 }}>
            {report.note}
          </AppText>
        ) : null}
      </View>

      <AppIcon name="ChevronRight" size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}
