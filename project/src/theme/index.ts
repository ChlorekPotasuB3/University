// Design tokens based on Polish flag colors and modern mobile standards
export const colors = {
  primary: '#2563EB',      // Polish-flag blue
  accent: '#DC2626',       // Polish-flag red
  neutral100: '#FFFFFF',
  neutral200: '#F5F5F5',
  neutral300: '#D1D5DB',
  neutral600: '#4B5563',
  neutral800: '#1F2937',
  success: '#10B981',
  warning: '#F59E0B',
};

export const darkColors = {
  primary: '#3B82F6',
  accent: '#F43F5E',
  neutral100: '#111827',
  neutral200: '#1F2937',
  neutral300: '#374151',
  neutral600: '#9CA3AF',
  neutral800: '#F9FAFB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  small: { fontSize: 14, fontWeight: '400' as const },
  micro: { fontSize: 12, fontWeight: '400' as const },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};