
export type CodeLanguage = 'html' | 'css' | 'js' | 'swiftui' | 'objc';

export interface GeneratedStyle {
  html: string;
  css: string;
  js: string;
  swiftui: string;
  objc: string;
  componentType: string;
  description: string;
}

export interface AppState {
  prompt: string;
  isGenerating: boolean;
  currentStyle: GeneratedStyle | null;
  error: string | null;
  activeLanguage: CodeLanguage;
}
