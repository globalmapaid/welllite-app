import http from '../http';

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  occupation?: string | null;
  job_description?: string | null;
  organisation?: string | null;
  privacy_policy_agreed: boolean;
  terms_agreed: boolean;
}

export async function register(data: RegisterRequest): Promise<void> {
  await http.post('/api/v1/auth/register', data);
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await http.post('/api/v1/auth/verify-email', data);
}

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await http.post('/api/v1/auth/forgot-password', data);
}

export interface VerifyResetOtpRequest {
  email: string;
  code: string;
}

export interface VerifyResetOtpResponse {
  reset_token: string;
}

export async function verifyResetOtp(data: VerifyResetOtpRequest): Promise<VerifyResetOtpResponse> {
  const response = await http.post('/api/v1/auth/verify-reset-otp', data);
  return response.data;
}

export interface ResetPasswordRequest {
  reset_token: string;
  new_password: string;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  const response = await http.post('/api/v1/auth/reset-password', data);
  return response.data;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Membership {
  membership_id: string;
  client_id: string;
  client_name: string;
  role: string;
}

export interface MembershipSelectionRequired {
  pre_auth_token: string;
  token_type: string;
  memberships: Membership[];
}

export async function getMemberships(): Promise<Membership[]> {
  const response = await http.get('/api/v1/auth/memberships');
  return response.data;
}

export type LoginResponse = AuthTokens | MembershipSelectionRequired;

export function isMembershipSelectionRequired(
  response: LoginResponse,
): response is MembershipSelectionRequired {
  return 'pre_auth_token' in response;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await http.post('/api/v1/auth/login', data);
  return response.data;
}

export interface SelectClientRequest {
  membership_id: string;
}

export async function selectClient(
  data: SelectClientRequest,
  preAuthToken: string,
): Promise<AuthTokens> {
  const response = await http.post('/api/v1/auth/select-client', data, {
    headers: { Authorization: `Bearer ${preAuthToken}` },
  });
  return response.data;
}

export interface MeResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_super_admin: boolean;
  email_verified_at: string | null;
}

export async function getMe(): Promise<MeResponse> {
  const response = await http.get('/api/v1/auth/me');
  return response.data;
}

export interface LogoutRequest {
  refresh_token: string;
}

export async function logout(data: LogoutRequest): Promise<void> {
  await http.post('/api/v1/auth/logout', data);
}
