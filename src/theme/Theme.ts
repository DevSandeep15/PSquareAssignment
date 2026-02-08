export const Colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#4CD964',
    danger: '#FF3B30',
    warning: '#FFCC00',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#8E8E93',
    border: '#C6C6C8',
    background: '#000000',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const Typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
    } as const,
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
    } as const,
    body: {
        fontSize: 16,
        fontWeight: 'normal',
    } as const,
    caption: {
        fontSize: 12,
        color: Colors.gray,
    } as const,
};
