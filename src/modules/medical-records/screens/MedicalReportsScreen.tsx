import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SectionList, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ReportsStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { usePatientReportsStore } from "./store/patientReports.store";

type Props = NativeStackScreenProps<ReportsStackParamList, "MedicalReports">;

type FilterKey = "week" | "month" | "quarter" | "all";

// Shape of a single report coming from the API
interface ApiReport {
  id: number;
  report_token: string;
  report_date: string;
  doctor_id: number;
  doctor_name: string;
  conclusion: string | null;
  pdf_attachment: string | null;
  tests: string[];
  remaining_tests_count: number;
  total_tests_count: number;
}

// Shape of the full API response
interface ApiReportsResponse {
  patient: { id: number; full_name: string; file_number: string };
  max_age_days: number;
  count: number;
  reports: ApiReport[];
}

interface MedicalReportSummary {
  id: string;
  report_token: string;
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

const DAYS_BY_FILTER: Record<FilterKey, number | null> = {
  week: 7,
  month: 30,
  quarter: 90,
  all: null,
};

// Helper function to format API reports into sectioned data grouped by Month & Year
function transformReportsToSections(reportsList: ApiReport[]): ReportSection[] {
  const grouped: { [key: string]: MedicalReportSummary[] } = {};

  reportsList.forEach((report) => {
    const dateObj = new Date(report.report_date);
    const monthYearTitle = dateObj
      .toLocaleString("en-US", { month: "long", year: "numeric" })
      .toUpperCase();

    // Format display date (e.g., "7 Oct 2026")
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const summary: MedicalReportSummary = {
      id: String(report.id),
      report_token: String(report.report_token),
      doctorName: report.doctor_name,
      date: formattedDate,
      tags: report.tests ?? [],
      note: report.conclusion ? `Conclusion: ${report.conclusion}` : undefined,
    };

    if (!grouped[monthYearTitle]) {
      grouped[monthYearTitle] = [];
    }
    grouped[monthYearTitle].push(summary);
  });

  return Object.keys(grouped).map((title) => ({
    title,
    data: grouped[title],
  }));
}

export function MedicalReportsScreen({ navigation }: any) {
  const theme = useAppTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const storeReports = usePatientReportsStore(
    (state) => state.reports
  ) as unknown as ApiReportsResponse | ApiReport[] | null;
  const getMedicalReports = usePatientReportsStore((state) => state.getMedicalReports);

  useEffect(() => {
    getMedicalReports();
  }, []);

  // Works whether the store holds the full response object or just the reports array
  const rawReports: ApiReport[] = useMemo(() => {
    if (!storeReports) return [];
    return Array.isArray(storeReports) ? storeReports : storeReports.reports ?? [];
  }, [storeReports]);

  const sections = useMemo(() => {
    // Date range filter
    const days = DAYS_BY_FILTER[activeFilter];
    const now = Date.now();

    const dateFiltered = days
      ? rawReports.filter((r) => {
          const diffDays = (now - new Date(r.report_date).getTime()) / 86400000;
          return diffDays <= days;
        })
      : rawReports;

    const transformed = transformReportsToSections(dateFiltered);
    if (!searchTerm.trim()) return transformed;

    const query = searchTerm.trim().toLowerCase();
    return transformed
      .map((section) => ({
        ...section,
        data: section.data.filter(
          (report) =>
            report.doctorName.toLowerCase().includes(query) ||
            report.date.toLowerCase().includes(query) ||
            report.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            (report.note && report.note.toLowerCase().includes(query))
        ),
      }))
      .filter((section) => section.data.length > 0);
  }, [rawReports, searchTerm, activeFilter]);

  // Navigate using the report_token
  const handleOpenReport = (report: MedicalReportSummary) => {
    console.log("report", report?.report_token);
    navigation.navigate("ReportDetails", { reportId: report?.report_token });
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
          <ReportCard report={item} onPress={() => handleOpenReport(item)} />
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
          {report.tags.map((tag, index) => (
            <View
              key={`${tag}-${index}`}
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