import { create } from 'zustand';
import { BranchData, Language, OrderType } from '@/types/branch';
import axios from 'axios';
import { Translation, translations } from '@/lib/i18n';

interface BranchStore {
    branchData: BranchData | null;
    selectedLanguage: Language | null;
    selectedOrderType: OrderType | null;
    t: Translation;
    isLoading: boolean;
    error: string | null;
    fetchBranchData: (branchId: string) => Promise<void>;
    setSelectedLanguage: (branchId: string, language: Language) => Promise<void>;
    setSelectedOrderType: (branchId: string, orderType: OrderType | null) => void;
    reset: (branchId: string | undefined) => Promise<void>;
}

const useBranchStore = create<BranchStore>((set) => ({
    branchData: null,
    isLoading: true,
    selectedLanguage: null,
    selectedOrderType: null,
    t: translations['tr' as keyof typeof translations],
    error: null,
    reset: async (branchId: string | undefined) => {
        return new Promise<void>((resolve) => {
            set({
                branchData: null,
                selectedLanguage: null,
                selectedOrderType: null,
                isLoading: true,
                error: null,
                t: translations['tr' as keyof typeof translations]
            });
            if (branchId) {
                localStorage.removeItem(`branch_orderType_${branchId}`);
            }
            resolve();
        });
    },
    setSelectedOrderType: (branchId: string, orderType: OrderType | null) => {
        set((prev) => ({ ...prev, selectedOrderType: orderType }));
        if(orderType){
            localStorage.setItem(`branch_orderType_${branchId}`, orderType);
        }else{
            localStorage.removeItem(`branch_orderType_${branchId}`);
        }
    },
    setSelectedLanguage: async (branchId: string, language: Language) => {
        try {
            const languageCode = language.Code.toLowerCase() as keyof typeof translations;
            const translation = translations[languageCode] || translations['tr'];
            set((prev) => ({ ...prev, selectedLanguage: {...language}, t: translation }));
            localStorage.setItem(`branch_language_${branchId}`, JSON.stringify({
                ...language
            }));
        } catch (error) {
            console.error('Error setting language:', error);
            // Fallback to Turkish if there's an error
            set((prev) => ({ ...prev, t: translations['tr'] }));
        }
    },
    fetchBranchData: async (branchId: string) => {
        set((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            // Check localStorage first
            const cachedData = localStorage.getItem(`branch_${branchId}`);
            const cachedLanguageData = localStorage.getItem(`branch_language_${branchId}`);
            if (cachedData) {
                const { data, timestamp } : { data: BranchData, timestamp: number } = JSON.parse(cachedData);
                const now = new Date().getTime();
                const fiveMinutes = 10 * 60 * 1000;

                if (now - timestamp < fiveMinutes) {
                    if(!cachedLanguageData) {
                        let language = data.Languages.find(
                            language => language.Key === data.DefaultLanguageKey
                        ) || data.Languages[0];
                        let lang = {...language}
                        set((prev) => ({ ...prev, selectedLanguage: lang, t: translations[lang.Code.toLowerCase() as keyof typeof translations] }));
                        localStorage.setItem(`branch_language_${branchId}`, JSON.stringify({
                            ...language
                        }));
                    }else{  
                        let lang = {...JSON.parse(cachedLanguageData)}
                        set((prev) => ({ ...prev, selectedLanguage: lang, t: translations[lang.Code.toLowerCase() as keyof typeof translations] }));
                    }
                    set((prev) => ({ ...prev, branchData: data, isLoading: false, error: null }));
                    return;
                }
            }

            // Fetch fresh data
            const response = await axios.get<BranchData[]>(`/api/${branchId}/getBranchData`);

            if (!response.data || !response.data.length) {
                throw new Error('Şube bilgisi bulunamadı');
            }

            const data = response.data[0];

            // Save to localStorage
            localStorage.setItem(`branch_${branchId}`, JSON.stringify({
                data,
                timestamp: new Date().getTime()
            }));
            console.log("cachedLanguageData", cachedLanguageData)
            // Get language store actions using getState
            if(!cachedLanguageData) {
                console.log("cachedLanguageData false")

                let language = data.Languages.find(
                    language => language.Key === data.DefaultLanguageKey
                ) || data.Languages[0];
                let lang = {...language}
                set((prev) => ({ ...prev, selectedLanguage: lang, t: translations[lang.Code.toLowerCase() as keyof typeof translations] }));
                localStorage.setItem(`branch_language_${branchId}`, JSON.stringify({
                    ...language
                }));
            }else{
                let lang = {...JSON.parse(cachedLanguageData)}
                set((prev) => ({ ...prev, selectedLanguage: lang, t: translations[lang.Code.toLowerCase() as keyof typeof translations] }));
            }

            set((prev) => ({ ...prev, branchData: data, isLoading: false, error: null }));
        } catch (error) {
            set((prev) => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Şube bilgileri yüklenemedi',
                isLoading: false,
                branchData: null
            }));
        }
    }
}));

export default useBranchStore;
