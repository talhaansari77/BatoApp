import { apiClient } from '../../../core/api/apiClient';

export type Branch = {
  id: string;
  name: string;
  phone?: string | null;
  address: string;
  city?: string | null;
  country?: string | null;
  isActive: boolean;
  createdAt: string;
};

export const branchesApi = {
  async getBranches() {
    const response = await apiClient.get<Branch[]>('/branches');
    return response.data;
  },
};