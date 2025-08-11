import { StyleSheet } from 'react-native-unistyles';

// 1) Themes
export const lightTheme = {
    colors: {
        background: '#FFFFFF',
        text: '#0B1220',
        card: '#F3F4F6',
        primary: '#2563EB',
        secondary: '#10B981',
        border: '#E5E7EB',
        muted: '#6B7280',
    },
    radius: { sm: 8, md: 12, xl: 24 },
    spacing: (n: number) => n * 8,
};

export const darkTheme = {
    colors: {
        background: '#0B0F17',
        text: '#E5E7EB',
        card: '#121826',
        primary: '#60A5FA',
        secondary: '#34D399',
        border: '#1F2937',
        muted: '#9CA3AF',
    },
    radius: { sm: 8, md: 12, xl: 24 },
    spacing: (n: number) => n * 8,
};

const appThemes = { light: lightTheme, dark: darkTheme };

// 2) Breakpoints (optional)
const breakpoints = {
    xs: 0,
    sm: 360,
    md: 480,
    lg: 768,
    xl: 1024,
};

// 3) Configure Unistyles
StyleSheet.configure({
    themes: appThemes,
    breakpoints,
    settings: {
        initialTheme: 'light',
        // points feel nicer for RN layouts; switch to 'pixels' if you prefer
        nativeBreakpointsMode: 'points',
    },
});

// 4) (Optional) TypeScript augmentation
export type AppThemes = typeof appThemes;
export type AppBreakpoints = typeof breakpoints;
declare module 'react-native-unistyles' {
    interface UnistylesThemes extends AppThemes { }
    interface UnistylesBreakpoints extends AppBreakpoints { }
}
