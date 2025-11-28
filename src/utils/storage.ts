import type { BrandKitSchema } from '../types';

const STORAGE_KEY = 'brand-kit-data';

export const saveToLocalStorage = (data: BrandKitSchema): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): BrandKitSchema | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as any;
      
      // Ensure backward compatibility - add missing fields if they don't exist
      if (parsed.brandFoundations) {
        if (!('brandStoryAndPurpose' in parsed.brandFoundations)) {
          parsed.brandFoundations.brandStoryAndPurpose = '';
        }
        if (!('enableRegions' in parsed.brandFoundations)) {
          parsed.brandFoundations.enableRegions = true;
        }
        if (!('enableAudiences' in parsed.brandFoundations)) {
          parsed.brandFoundations.enableAudiences = true;
        }
      }
      
      return parsed as BrandKitSchema;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

export const getEmptySchema = (): BrandKitSchema => ({
  brandFoundations: {
    brandName: '',
    brandDomain: '',
    brandIcon: undefined,
    aboutYourBrand: '',
    brandStoryAndPurpose: '',
    brandToneAndVoice: '',
    writingRules: [],
    enableRegions: true,
    enableAudiences: true,
  },
  productLines: [],
  contentTypes: [],
  audiences: [],
  regions: [],
  examples: [],
  writingRules: [],
});

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

