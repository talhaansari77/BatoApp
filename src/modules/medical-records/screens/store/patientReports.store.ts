import { create } from "zustand";
import { patientReportsApi } from "../services/patientReports.Api";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type PatientAppointmentState = {
  reports: any | null;
  reportDetails?: any | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
  getMedicalReports: () => Promise<void>;
  getMedicalReportDetails: (report_token: string) => Promise<void>;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const usePatientReportsStore = create<PatientAppointmentState>(
  (set) => ({
    reports: null,
    reportDetails: null,
    status: "checking",
    isLoading: false,
    error: null,

    // getMedicalReports
    getMedicalReports: async () => {
      try {
        set({
          status: "checking",
          isLoading: true,
          error: null,
        });

        const response = await patientReportsApi.getMedicalReports("all", "");

        console.log("Patient Reports:", response);
        set({
          reports: response,
          status: "authenticated",
          isLoading: false,
        });
      } catch (error) {
        set({
          reports: null,
          status: "unauthenticated",
          isLoading: false,
          error: getErrorMessage(error),
        });
      }
    },

    // getMedicalReportDetails
    getMedicalReportDetails: async (report_token: string) => {
      try {
        set({
          status: "checking",
          isLoading: true,
          error: null,
        });

        const response =
          await patientReportsApi.getMedicalReportDetails(report_token);

        console.log("Patient Reports:", response);
        set({
          reportDetails: response,
          status: "authenticated",
          isLoading: false,
        });
      } catch (error) {
        set({
          reportDetails: null,
          status: "unauthenticated",
          isLoading: false,
          error: getErrorMessage(error),
        });
      }
    },
  }),
);
