import { create } from 'zustand';

interface Branch {
    BranchID: number;
    BranchName: string;
    KioskMenuTemplateKey: string;
    PriceTemplateKey: string;
    IsActive: boolean;
    MenuTemplateName?: string;
    PriceTemplateName?: string;
    UpdatedAt?: string;
}

interface BranchSettings {
    BranchID: number;
    MainColor: string;
    SecondColor: string;
    AccentColor: string;
    DefaultLanguageKey: string;
    LogoUrl: string;
}

interface BranchLanguage {
    BranchID: number;
    LanguageKey: string;
    IsActive: boolean;
}

interface BranchBanner {
    BannerID: number;
    BranchID: number;
    BannerUrl: string;
    DisplayOrder: number;
    IsActive: boolean;
}

interface BranchStore {
    branches: Branch[];
    settings: Record<number, BranchSettings>;
    languages: Record<number, BranchLanguage[]>;
    banners: Record<number, BranchBanner[]>;
    isLoading: boolean;
    error: string | null;
    fetchBranches: () => Promise<void>;
    setBranches: (branches: Branch[]) => void;
    setSettings: (settings: Record<number, BranchSettings>) => void;
    setLanguages: (languages: Record<number, BranchLanguage[]>) => void;
    setBanners: (banners: Record<number, BranchBanner[]>) => void;
}

const useBranchStore = create<BranchStore>((set) => ({
    branches: [],
    settings: {},
    languages: {},
    banners: {},
    isLoading: false,
    error: null,
    fetchBranches: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/getBranches');
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
            set({
                branches: data.branches,
                settings: data.settings,
                languages: data.languages,
                banners: data.banners,
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
    setSettings: (settings) => set({ settings }),
    setLanguages: (languages) => set({ languages }),
    setBanners: (banners) => set({ banners })
}));

export default useBranchStore;
