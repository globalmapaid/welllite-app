jest.mock('./serverMessages', () => ({
  serverMessages: [
    // 'om' intentionally omitted to exercise the fallback-to-en path.
    { en: 'Invalid credentials', am: 'የመግቢያ መረጃ የተሳሳተ', 'am-Latn': 'Yemegbiya mereja yetesasate' },
  ],
}));

import { translateServerMessage } from './index';

describe('translateServerMessage', () => {
  it('returns the translated string for a known message + locale', () => {
    expect(translateServerMessage('Invalid credentials', 'am')).toBe('የመግቢያ መረጃ የተሳሳተ');
  });

  it('falls back to en when the locale entry is missing', () => {
    expect(translateServerMessage('Invalid credentials', 'om')).toBe('Invalid credentials');
  });

  it('returns the original string unchanged when there is no match', () => {
    expect(translateServerMessage('Some unmapped error', 'am')).toBe('Some unmapped error');
  });

  it('returns undefined unchanged', () => {
    expect(translateServerMessage(undefined, 'am')).toBeUndefined();
  });
});
