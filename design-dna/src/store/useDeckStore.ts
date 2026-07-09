import { create } from 'zustand';
import { DeckSpec, Slide } from '../types';

interface DeckState {
  currentDeck: DeckSpec | null;
  activeSlideIdx: number;
  isGenerating: boolean;
  generationStage: string;
  conceptRationale: string;
  setDeck: (deck: DeckSpec) => void;
  setActiveSlideIdx: (idx: number) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGenerationStage: (stage: string) => void;
  setConceptRationale: (text: string) => void;
  updateSlideContent: (slideId: string, updatedContent: any) => void;
  updateDesignToken: (section: string, key: string, value: any) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  currentDeck: null,
  activeSlideIdx: 0,
  isGenerating: false,
  generationStage: '',
  conceptRationale: '',

  setDeck: (deck) => set({ currentDeck: deck, activeSlideIdx: 0 }),
  setActiveSlideIdx: (idx) => set({ activeSlideIdx: idx }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationStage: (stage) => set({ generationStage: stage }),
  setConceptRationale: (text) => set({ conceptRationale: text }),
  
  updateSlideContent: (slideId, updatedContent) => set((state) => {
    if (!state.currentDeck) return {};
    const slides = state.currentDeck.slides.map((slide) => {
      if (slide.id === slideId) {
        return {
          ...slide,
          content: {
            ...slide.content,
            ...updatedContent,
          },
        };
      }
      return slide;
    });
    return {
      currentDeck: {
        ...state.currentDeck,
        slides,
      },
    };
  }),

  updateDesignToken: (section, key, value) => set((state) => {
    if (!state.currentDeck) return {};
    const dns = state.currentDeck.design_dna;
    
    // Type-safe dynamic path updater for DesignDNA structure
    const updatedDNA = {
      ...dns,
      [section]: {
        ...(dns[section as keyof typeof dns] || {}),
        [key]: value
      }
    };

    return {
      currentDeck: {
        ...state.currentDeck,
        design_dna: updatedDNA as any,
      },
    };
  }),

  nextSlide: () => set((state) => {
    if (!state.currentDeck) return {};
    const maxIdx = state.currentDeck.slides.length - 1;
    return {
      activeSlideIdx: Math.min(maxIdx, state.activeSlideIdx + 1),
    };
  }),

  prevSlide: () => set((state) => ({
    activeSlideIdx: Math.max(0, state.activeSlideIdx - 1),
  })),
}));
