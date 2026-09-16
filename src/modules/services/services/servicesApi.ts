import { apiClient } from "../../../core/api/apiClient";

export type ClinicService = {
  id: string;
  serviceCategoryId: string;
  categoryName: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
};

export const servicesApi = {
  async getServices() {
    const response = await apiClient.get<ClinicService[]>("/services");
    return response.data;
  },

  async getServiceById(serviceId: string) {
    const response = await apiClient.get<ClinicService>(`/services/${serviceId}`);
    return response.data;
  },
};