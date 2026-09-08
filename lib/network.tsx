import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";

interface NetworkContextValue {
  isConnected: boolean | null;
  devOverride: boolean | null;
  setDevOverride: (value: boolean | null) => void;
}

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: null,
  devOverride: null,
  setDevOverride: () => {},
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [realIsConnected, setRealIsConnected] = useState<boolean | null>(null);
  const [devOverride, setDevOverrideState] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected === true && state.isInternetReachable !== false;
      console.log("[Network] isConnected:", connected, "| type:", state.type);
      setRealIsConnected(connected);
    });

    return unsubscribe;
  }, []);

  function setDevOverride(value: boolean | null) {
    if (!__DEV__) return;
    setDevOverrideState(value);
  }

  const isConnected = __DEV__ && devOverride !== null ? devOverride : realIsConnected;

  return (
    <NetworkContext.Provider value={{ isConnected, devOverride, setDevOverride }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  return useContext(NetworkContext);
}
