import React, { useEffect } from "react";
import { Linking, Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ReportsStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { usePatientReportsStore } from "./store/patientReports.store";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { reportDetail } from "../Molecules";







type Props = NativeStackScreenProps<ReportsStackParamList, "ReportDetails">;

export function ReportDetailsScreen({ navigation, route }: any) {
  const theme = useAppTheme();
  const { reportId } = route.params;

  const report = usePatientReportsStore((state) => state.reportDetails);
  const getMedicalReportDetails = usePatientReportsStore((state) => state.getMedicalReportDetails);

  useEffect(() => {
    console.log("reportId", reportId);
    getMedicalReportDetails(reportId);
  }, [reportId]);

  const handlePrint = async () => {
    const html = reportDetail(report);
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const handleOpenPdf = () => {
    if (report?.pdf_attachment) {
      Linking.openURL(report.pdf_attachment);
    }
  };

  if (!report) {
    return (
      <Screen title="Report Details" showBack onBackPress={() => navigation.goBack()}>
        <AppText color={theme.colors.textMuted} style={{ marginTop: theme.spacing.md }}>
          Loading report details...
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen title="Report Details" showBack onBackPress={() => navigation.goBack()}>
      <View style={{ gap: theme.spacing.md, paddingBottom: theme.spacing.xl }}>
        {/* Print Action Button */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable
            onPress={handlePrint}
            style={({pressed})=>([{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
            pressed && {
              opacity: 0.82,
              transform: [{ scale: 0.91 }],
            },
          ])}
          >
            <AppIcon name="Printer" size={16} color={theme.colors.text} />
            <AppText variant="bodyMedium" color={theme.colors.text}>
              Print
            </AppText>
          </Pressable>
        </View>

        {/* Main Info Card */}
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
          <View style={{ alignItems: "flex-end" }}>
              <AppText variant="small" color={theme.colors.textMuted}>
                Report Date
              </AppText>
              <AppText variant="bodyMedium" color={theme.colors.text}>
                {report.report_date}
              </AppText>
            </View>
          {/* Header section */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <AppText variant="h2" color={theme.colors.text}>
                Medical Investigation
              </AppText>
              <AppText variant="small" color={theme.colors.textMuted}>
                Token: #{report.report_token}
              </AppText>
            </View>
            
          </View>

          <View style={{ height: 1, backgroundColor: theme.colors.border }} />

          {/* Doctor Info */}
          <View style={{ gap: theme.spacing.xs }}>
            <InfoRow label="Doctor Name" value={report.doctor_name} />
          </View>

          {/* Conclusion / Notes section */}
          {report.conclusion ? (
            <View
              style={{
                backgroundColor: theme.colors.cardMuted,
                borderRadius: 10,
                padding: theme.spacing.sm,
                gap: 4,
                marginTop: 4,
              }}
            >
              <AppText variant="small" color={theme.colors.textMuted}>
                Conclusion / Notes:
              </AppText>
              <AppText variant="bodyMedium" color={theme.colors.text}>
                {report.conclusion}
              </AppText>
            </View>
          ) : null}

          <View style={{ height: 1, backgroundColor: theme.colors.border }} />

          {/* Tests Section */}
          <AppText variant="bodyMedium" color={theme.colors.textMuted}>
            TESTS ({report.tests?.length ?? 0})
          </AppText>

          <View style={{ gap: theme.spacing.sm }}>
            {report.tests?.map((item: any) => {
              const isNormal = item.flag.toLowerCase() === "normal";
              const flagBgColor = isNormal ? "#DCFCE7" : "#FEE2E2";
              const flagTextColor = isNormal ? "#166534" : "#991B1B";

              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: theme.colors.cardMuted,
                    borderRadius: 12,
                    padding: theme.spacing.sm,
                    gap: 8,
                  }}
                >
                  {/* Test Name & Flag Badge */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <AppText variant="bodyMedium" color={theme.colors.text} style={{ flex: 1, fontWeight: "600" }}>
                      {item.test_name}
                    </AppText>
                    <View
                      style={{
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        borderRadius: 6,
                        backgroundColor: flagBgColor,
                      }}
                    >
                      <AppText variant="small" color={flagTextColor} style={{ fontWeight: "600" }}>
                        {item.flag}
                      </AppText>
                    </View>
                  </View>

                  {/* Value, Unit, & Reference Range */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <View>
                      <AppText variant="small" color={theme.colors.textMuted}>Result</AppText>
                      <AppText variant="bodyMedium" color={theme.colors.text}>
                        {item.test_value} {item.unit}
                      </AppText>
                    </View>
                    {item.normal_range ? (
                      <View style={{ alignItems: "flex-end" }}>
                        <AppText variant="small" color={theme.colors.textMuted}>Ref. Range</AppText>
                        <AppText variant="small" color={theme.colors.text}>
                          {item.normal_range}
                        </AppText>
                      </View>
                    ) : null}
                  </View>

                  {/* Remarks if available */}
                  {item.remarks ? (
                    <View style={{ borderTopWidth: 1, borderColor: theme.colors.border, paddingTop: 6, marginTop: 2 }}>
                      <AppText variant="small" color={theme.colors.textMuted}>
                        Remarks: {item.remarks}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Attached PDF Section */}
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
              {report.pdf_attachment
                ? "A detailed PDF has been attached. Click to open."
                : "No PDF document attached to this report."}
            </AppText>
          </View>
        </View>

        {report.pdf_attachment && (
          <AppButton title="View / Download PDF" onPress={handleOpenPdf} />
        )}
      </View>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <AppText variant="small" color="textMuted">
        {label}
      </AppText>
      <AppText variant="small" color="text">
        {value}
      </AppText>
    </View>
  );
}