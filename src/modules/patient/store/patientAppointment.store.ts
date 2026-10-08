import { create } from "zustand";

import { patientApi } from "../services/patientAppointment.Api";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";


type PatientAppointmentState = {
  appointments: any | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;

  getPatientAppointments: (patientId?: number) => Promise<void>;
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

  

  getPatientAppointments: async (patientId?: number) => {
    try {
      set({
        status: "checking",
        isLoading: true,
        error: null,
      });

      const response = await patientApi.getPatientAppointments(patientId);

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
