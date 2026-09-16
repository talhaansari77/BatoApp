import React from "react";
import { Linking, Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// NOTE: same assumption as MedicalReportsScreen — adjust the import path
// to your actual navigation types file.
//   export type ReportsStackParamList = {
//     MedicalReports: undefined;
//     ReportDetails: { reportId: string };
//   };
import { ReportsStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";

type Props = NativeStackScreenProps<ReportsStackParamList, "ReportDetails">;

interface TestRow {
  test: string;
  result: string;
  unit: string;
  refRange: string;
  remarks: string;
  isNormal: boolean;
}

interface ReportDetailData {
  clinic: {
    name: string;
    tagline: string;
    handle: string;
    phones: string[];
    address: string;
    email: string;
  };
  patient: { name: string; civilId: string; mobile: string };
  file: { fileNo: string; doctorName: string; reportDate: string };
  tests: TestRow[];
  pdfUrl: string;
}

// Placeholder lookup keyed by reportId — replace with your real fetch
// (e.g. useQuery(['report', reportId], fetchReport)).
const MOCK_REPORTS: Record<string, ReportDetailData> = {
  rep_2026_07_05_a: {
    clinic: {
      name: "BATO",
      tagline: "Health/Beauty",
      handle: "@BATOCLINIC",
      phones: ["12345678", "12345678"],
      address: "SALMIYA, BLOCK 75, BUILDING 24",
      email: "CLINICBATO@GMAIL.COM",
    },
    patient: { name: "talha", civilId: "297070707087", mobile: "15478692" },
    file: {
      fileNo: "202670702026",
      doctorName: "Mr Doctor",
      reportDate: "05/07/2026",
    },
    tests: [
      {
        test: "Vitamin B12",
        result: "236.4",
        unit: "Pmol/L",
        refRange: "145-639",
        remarks: "Vitamin B12",
        isNormal: true,
      },
      {
        test: "Vitamin D",
        result: "53.53",
        unit: "ng/mL",
        refRange: "Deficiency: <10 / Insufficiency: 10-30 / Sufficiency: 30-100 / Toxicity: >100",
        remarks: "Vitamin D",
        isNormal: true,
      },
    ],
    pdfUrl: "https://example.com/reports/rep_2026_07_05_a.pdf",
  },
};

export function ReportDetailsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const { reportId } = route.params;

  const report = MOCK_REPORTS[reportId];

  const handlePrint = () => {
    // TODO: wire up to your print flow, e.g. expo-print's printAsync.
  };

  const handleOpenPdf = () => {
    if (report?.pdfUrl) {
      Linking.openURL(report.pdfUrl);
    }
  };

  if (!report) {
    return (
      <Screen title="Report Details" showBack onBackPress={() => navigation.goBack()}>
        <AppText color={theme.colors.textMuted}>
          This report couldn't be found.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen title="Report Details" showBack onBackPress={() => navigation.goBack()}>
      <View style={{ gap: theme.spacing.md }}>
        {/* Screen doesn't expose a header-right slot in this codebase yet,
            so Print is placed as the first action in the body. Move it into
            Screen itself if you add that capability there. */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable
            onPress={handlePrint}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <AppIcon name="Printer" size={16} color={theme.colors.text} />
            <AppText variant="bodyMedium" color={theme.colors.text}>
              Print
            </AppText>
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 16,
            padding: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          {/* Clinic header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <AppText variant="h2" color={theme.colors.text}>
                {report.clinic.name}
              </AppText>
              <AppText variant="small" color={theme.colors.textMuted}>
                {report.clinic.tagline}
              </AppText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <AppText variant="small" color={theme.colors.textMuted}>
                {report.clinic.handle}
              </AppText>
              <AppText variant="small" color={theme.colors.textMuted}>
                {report.clinic.phones.join(" | ")}
              </AppText>
              <AppText variant="small" color={theme.colors.textMuted}>
                {report.clinic.address}
              </AppText>
              <AppText variant="small" color={theme.colors.textMuted}>
                {report.clinic.email}
              </AppText>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: theme.colors.border }} />

          {/* Patient / file info grid */}
          <View style={{ flexDirection: "row", gap: theme.spacing.lg }}>
            <View style={{ flex: 1, gap: 4 }}>
              <InfoRow label="Patient Name" value={report.patient.name} />
              <InfoRow label="Civil ID" value={report.patient.civilId} />
              <InfoRow label="Mobile" value={report.patient.mobile} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <InfoRow label="File No." value={report.file.fileNo} />
              <InfoRow label="Doctor Name" value={report.file.doctorName} />
              <InfoRow label="Report Date" value={report.file.reportDate} />
            </View>
          </View>

          <AppText variant="bodyMedium" color={theme.colors.textMuted}>
            MEDICAL REPORT
          </AppText>

          {/* Results table */}
          <View style={{ gap: theme.spacing.sm }}>
            <View style={{ flexDirection: "row" }}>
              <TableHeaderCell label="Test" flex={1.2} />
              <TableHeaderCell label="Result" flex={1} />
              <TableHeaderCell label="Unit" flex={1} />
              <TableHeaderCell label="Ref. Range" flex={1.6} />
              <TableHeaderCell label="Remarks" flex={1} />
            </View>

            {report.tests.map((row, index) => (
              <View
                key={row.test}
                style={{
                  flexDirection: "row",
                  paddingVertical: theme.spacing.sm,
                  borderTopWidth: index === 0 ? 1 : 0,
                  borderColor: theme.colors.border,
                }}
              >
                <View style={{ flex: 1.2 }}>
                  <AppText variant="small" color={theme.colors.text}>
                    {row.test}
                  </AppText>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="small" color={theme.colors.text}>
                    {row.result}
                  </AppText>
                  <View
                    style={{
                      alignSelf: "flex-start",
                      paddingVertical: 2,
                      paddingHorizontal: 6,
                      borderRadius: 6,
                      backgroundColor: row.isNormal ? "#DCFCE7" : "#FEE2E2",
                    }}
                  >
                    <AppText
                      variant="small"
                      color={row.isNormal ? "#166534" : "#991B1B"}
                    >
                      {row.isNormal ? "NORMAL" : "ABNORMAL"}
                    </AppText>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="small" color={theme.colors.text}>
                    {row.unit}
                  </AppText>
                </View>
                <View style={{ flex: 1.6 }}>
                  <AppText variant="small" color={theme.colors.textMuted}>
                    {row.refRange}
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="small" color={theme.colors.textMuted}>
                    {row.remarks}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Attached PDF */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.cardMuted,
            borderRadius: 14,
            padding: theme.spacing.md,
          }}
        >
          <AppIcon name="Paperclip" size={20} color={theme.colors.textMuted} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyMedium" color={theme.colors.text}>
              Attached Report Document
            </AppText>
            <AppText variant="small" color={theme.colors.textMuted}>
              A detailed PDF has been attached by your doctor. Click to open or
              download.
            </AppText>
          </View>
        </View>
          <AppButton title="View / Download PDF" onPress={handleOpenPdf} />
      </View>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      <AppText variant="small" color={theme.colors.textMuted}>
        {label}:
      </AppText>
      <AppText variant="small" color={theme.colors.text}>
        {value}
      </AppText>
    </View>
  );
}

function TableHeaderCell({ label, flex }: { label: string; flex: number }) {
  const theme = useAppTheme();
  return (
    <View style={{ flex }}>
      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}
