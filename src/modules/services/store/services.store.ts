import { create } from "zustand";

import { ClinicService, servicesApi } from "../services/servicesApi";

type ServicesState = {
  services: ClinicService[];
  selectedService: ClinicService | null;
  isLoading: boolean;
  isDetailsLoading: boolean;
  error: string | null;
  detailsError: string | null;

  fetchServices: () => Promise<void>;
  fetchServiceById: (serviceId: string) => Promise<void>;
  setSelectedService: (service: ClinicService | null) => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  isDetailsLoading: false,
  error: null,
  detailsError: null,

  fetchServices: async () => {
    try {
      set({ isLoading: true, error: null });

      const services = await servicesApi.getServices();

      set({
        services,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error, "Failed to load services"),
      });
    }
  },

  fetchServiceById: async (serviceId: string) => {
    try {
      const cachedService = get().services.find(
        (service) => service.id === serviceId,
      );

      if (cachedService) {
        set({ selectedService: cachedService, detailsError: null });
      }

      set({ isDetailsLoading: true, detailsError: null });

      const service = await servicesApi.getServiceById(serviceId);

      set({
        selectedService: service,
        isDetailsLoading: false,
      });
    } catch (error) {
      set({
        isDetailsLoading: false,
        detailsError: getErrorMessage(error, "Failed to load service details"),
      });
    }
  },

  setSelectedService: (service) => {
    set({ selectedService: service });
  },
}));