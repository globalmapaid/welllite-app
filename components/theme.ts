export const colors = {
  bg: '#FFFFFF',
  text: '#1C1C1C',
  inputBg: '#F2F2F2',
  placeholder: '#AAAAAA',
  border: '#DDDDDD',
  error: '#D32F2F',
  white: '#FFFFFF',
  subtitleGray: '#555555',
  iconCircleBg: '#EBEBEB',
} as const;

export const dimensions = {
  inputHeight: 56,
  radius: 28,
  paddingH: 24,
  multilineHeight: 100,
  multilineRadius: 16,
} as const;

export const typography = {
  input: { fontSize: 15 },
  label: { fontSize: 14, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
  error: { fontSize: 12 },
} as const;
