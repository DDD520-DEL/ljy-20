const STORAGE_KEY = 'funeral_planner_data';
const TEMPLATES_STORAGE_KEY = 'funeral_planner_templates';

export const saveToStorage = (data: unknown): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = <T>(): T | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const saveTemplatesToStorage = (templates: unknown): void => {
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save templates to localStorage:', error);
  }
};

export const loadTemplatesFromStorage = <T>(): T | null => {
  try {
    const data = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load templates from localStorage:', error);
    return null;
  }
};

export const clearTemplatesStorage = (): void => {
  try {
    localStorage.removeItem(TEMPLATES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear templates storage:', error);
  }
};
