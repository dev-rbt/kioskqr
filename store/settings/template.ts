import { create } from 'zustand';
import { Template } from '@/types/settings';

interface TemplateStore {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  setTemplates: (templates: Template[]) => void;
  updateTemplate: (templateKey: string, updatedTemplate: Template) => void;
  fetchTemplates: () => Promise<void>;
}

const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  isLoading: false,
  error: null,
  setTemplates: (templates) => set({ templates }),
  updateTemplate: (templateKey, updatedTemplate) => {
    set((state) => ({
      templates: state.templates.map((template) =>
        template.TemplateKey === templateKey ? updatedTemplate : template
      )
    }));
  },
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/getMenuTemplates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      set({ templates: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching templates:', error);
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  }
}));

export default useTemplateStore;
