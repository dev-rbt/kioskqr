import { create } from 'zustand';
import axios from 'axios';
import { Branch } from '@/types/settings';

interface BranchStore {
    branches: Branch[];
    isLoading: boolean;
    error: string | null;
    fetchBranches: () => Promise<void>;
    setBranches: (branches: Branch[]) => void;
}

const useBranchStore = create<BranchStore>((set) => ({
    branches: [],
    isLoading: false,
    error: null,
    fetchBranches: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/getBranches');
            if (response.status !== 200) {
                throw new Error('Failed to fetch branches');
            }

            set({
                branches: response.data,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            });
        }
    },
    setBranches: (branches) => set({ branches }),
}));

export default useBranchStore;