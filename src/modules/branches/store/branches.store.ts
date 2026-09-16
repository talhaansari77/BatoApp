import { create } from 'zustand';

import { Branch, branchesApi } from '../services/branchesApi';

type BranchesState = {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to load branches';
}

export const useBranchesStore = create<BranchesState>((set) => ({
  branches: [],
  isLoading: false,
  error: null,

  fetchBranches: async () => {
    try {
      set({ isLoading: true, error: null });

      const branches = await branchesApi.getBranches();

      set({
        branches,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },
}));