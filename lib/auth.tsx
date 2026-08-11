import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "./api/auth";
import {
  clearTokens,
  clearUser,
  getAccessToken,
  getRefreshToken,
  getUser,
  setActiveMembershipId,
  setForceLogoutListener,
  storeTokens,
  storeUser,
} from "./http";

const MIN_SPLASH_MS = 1250;

type AuthStatus = "loading" | "signedIn" | "signedOut";

interface PendingSelection {
  preAuthToken: string;
  memberships: authApi.Membership[];
}

interface AuthContextValue {
  status: AuthStatus;
  pendingSelection: PendingSelection | null;
  user: authApi.MeResponse | null;
  signIn: (email: string, password: string) => Promise<void>;
  selectMembership: (membershipId: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchMembership: (membershipId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [user, setUser] = useState<authApi.MeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [token, cachedUser] = await Promise.all([
        getAccessToken(),
        getUser(),
        delay(MIN_SPLASH_MS),
      ]);
      if (cancelled) return;
      setUser(cachedUser);
      setStatus(token ? "signedIn" : "signedOut");
      if (token) {
        try {
          const freshUser = await authApi.getMe();
          if (!cancelled) {
            setUser(freshUser);
            await storeUser(freshUser);
          }
        } catch {
          // offline-first: fall back to the cached user when the refresh fails
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setForceLogoutListener(() => {
      setPendingSelection(null);
      setUser(null);
      setStatus("signedOut");
    });
    return () => setForceLogoutListener(null);
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    const result = await authApi.login({ email, password });
    if (authApi.isMembershipSelectionRequired(result)) {
      setPendingSelection({
        preAuthToken: result.pre_auth_token,
        memberships: result.memberships,
      });
      return;
    }
    await storeTokens(result);
    const me = await authApi.getMe();
    setUser(me);
    await storeUser(me);
    setStatus("signedIn");
  }

  async function selectMembership(membershipId: string): Promise<void> {
    if (!pendingSelection) return;
    const tokens = await authApi.selectClient(
      { membership_id: membershipId },
      pendingSelection.preAuthToken,
    );
    await storeTokens(tokens);
    await setActiveMembershipId(membershipId);
    const me = await authApi.getMe();
    setUser(me);
    await storeUser(me);
    setPendingSelection(null);
    setStatus("signedIn");
  }

  async function switchMembership(membershipId: string): Promise<void> {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("Not signed in");
    const tokens = await authApi.selectClient({ membership_id: membershipId }, accessToken);
    await storeTokens(tokens);
    await setActiveMembershipId(membershipId);
  }

  async function signOut(): Promise<void> {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout({ refresh_token: refreshToken });
      } catch {
        // offline-first: local sign-out must succeed even if the server call fails
      }
    }
    await clearTokens();
    await clearUser();
    setPendingSelection(null);
    setUser(null);
    setStatus("signedOut");
  }

  return (
    <AuthContext.Provider
      value={{ status, pendingSelection, user, signIn, selectMembership, signOut, switchMembership }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return value;
}
