import { isMembershipSelectionRequired, type AuthTokens, type MembershipSelectionRequired } from './auth';

describe('isMembershipSelectionRequired', () => {
  it('returns true when the response carries a pre_auth_token', () => {
    const response: MembershipSelectionRequired = {
      pre_auth_token: 'pre-auth',
      token_type: 'bearer',
      memberships: [],
    };
    expect(isMembershipSelectionRequired(response)).toBe(true);
  });

  it('returns false for a plain token response', () => {
    const response: AuthTokens = {
      access_token: 'access',
      refresh_token: 'refresh',
      token_type: 'bearer',
    };
    expect(isMembershipSelectionRequired(response)).toBe(false);
  });
});
