import { create } from "zustand";

import { tokenStorage } from "../../../core/storage/tokenStorage";
import { Appointment, patientApi } from "../services/patientAppointment.Api";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";


type PatientAppointmentState = {
  appointments: any | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;

  bootstrapAuth: () => Promise<void>;
  getPatientAppointments: () => Promise<void>;
  clearError: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const usePatientAppointmentStore = create<PatientAppointmentState>((set) => ({
  appointments: null,
  status: "checking",
  isLoading: false,
  error: null,

  // Runs when app starts.
  // If saved token exists, we call /auth/me to restore user session.
  bootstrapAuth: async () => {
    try {
      set({
        status: "checking",
        isLoading: true,
        error: null,
      });

      

      // set({
      //         user: null,
      //         status: "unauthenticated",
      //         isLoading: false,
      //         error: getErrorMessage(error),
      //       });
    } catch (error) {
      await tokenStorage.clearTokens();

      set({
        appointments: null,
        status: "unauthenticated",
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  getPatientAppointments: async () => {
    try {
        set({
        status: "checking",
        isLoading: true,
        error: null,
      });

      const response = await patientApi.getPatientAppointments();

      console.log("Patient Appointments:", response[0]);
      set({
        appointments: response,
        status: "authenticated",
        isLoading: false,
      });
    } catch (error) {
      set({
        appointments: null,
        status: "unauthenticated",
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
