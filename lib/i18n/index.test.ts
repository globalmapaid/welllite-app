jest.mock('./translations', () => ({
  translations: {
    // 'om' intentionally omitted to exercise the fallback-to-en path.
    greeting: { en: 'Hello {{name}}', am: 'ሰላም {{name}}', 'am-Latn': 'Selam {{name}}' },
  },
}));

import { interpolate, resolveTranslation } from './index';

describe('interpolate', () => {
  it('replaces {{var}} placeholders', () => {
    expect(interpolate('Hello {{name}}!', { name: 'Sam' })).toBe('Hello Sam!');
  });

  it('replaces repeated placeholders', () => {
    expect(interpolate('{{x}} and {{x}}', { x: 'A' })).toBe('A and A');
  });

  it('returns the text unchanged when no vars are given', () => {
    expect(interpolate('Hello {{name}}!')).toBe('Hello {{name}}!');
  });
});

describe('resolveTranslation', () => {
  it('returns the string for the current locale, interpolated', () => {
    expect(resolveTranslation('greeting', 'am', { name: 'Sam' })).toBe('ሰላም Sam');
  });

  it('falls back to en when the current locale has no entry', () => {
    expect(resolveTranslation('greeting', 'om', { name: 'Sam' })).toBe('Hello Sam');
  });

  it('returns the raw key when it has no translation entry at all', () => {
    expect(resolveTranslation('missingKey', 'en')).toBe('missingKey');
  });
});
