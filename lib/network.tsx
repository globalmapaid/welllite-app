import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useState } from "react";

interface NetworkContextValue {
  isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: null,
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected;
      console.log("[Network] isConnected:", connected, "| type:", state.type);
      setIsConnected(connected);
    });

    return unsubscribe;
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  return useContext(NetworkContext);
}
