import { StyleSheet } from 'react-native-unistyles';

export const lightTheme = {
    colors: {
        background: '#FFFFFF',
        text: '#0B1220',
        card: '#F3F4F6',
        primary: '#2563EB',
        secondary: '#10B981',
        border: '#E5E7EB',
        muted: '#6B7280',
        danger: '#EF4444',
        success: '#16A34A',
        warning: '#F59E0B',
    },
    barStyle: 'dark-content' as const,
    radius: { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
    spacing: (n: number) => n * 8,
    typography: {
        title: { fontSize: 22, fontWeight: '700' as const },
        subtitle: { fontSize: 18, fontWeight: '600' as const },
        body: { fontSize: 16, fontWeight: '400' as const },
        caption: { fontSize: 12, fontWeight: '400' as const },
    },
};

export const darkTheme = {
    colors: {
        background: '#111b30ff',
        text: '#E5E7EB',
        card: '#121826',
        primary: '#60A5FA',
        secondary: '#34D399',
        border: '#1F2937',
        muted: '#9CA3AF',
        danger: '#F87171',
        success: '#22C55E',
        warning: '#FBBF24',
    },
    barStyle: 'light-content' as const,
    radius: { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
    spacing: (n: number) => n * 8,
    typography: {
        title: { fontSize: 22, fontWeight: '700' as const },
        subtitle: { fontSize: 18, fontWeight: '600' as const },
        body: { fontSize: 16, fontWeight: '400' as const },
        caption: { fontSize: 12, fontWeight: '400' as const },
    },
};

const appThemes = { light: lightTheme, dark: darkTheme };
const breakpoints = { xs: 0, sm: 360, md: 480, lg: 768, xl: 1024 };

StyleSheet.configure({
    themes: appThemes,
    breakpoints,
    settings: {
        initialTheme: 'light',
        nativeBreakpointsMode: 'points',
    },
});

export type AppThemes = typeof appThemes;
export type AppBreakpoints = typeof breakpoints;
declare module 'react-native-unistyles' {
    interface UnistylesThemes extends AppThemes { }
    interface UnistylesBreakpoints extends AppBreakpoints { }
}
