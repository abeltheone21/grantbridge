"use client";

import { createContext, useContext, useState } from "react";

type Grant = {
  id: number;
  title: string;
};

type GrantContextType = {
  applied: Grant[];
  apply: (grant: Grant) => void;
};

const GrantContext = createContext<GrantContextType | null>(null);

export function GrantProvider({ children }: { children: React.ReactNode }) {
  const [applied, setApplied] = useState<Grant[]>([]);

  const apply = (grant: Grant) => {
    setApplied((prev) => [...prev, grant]);
  };

  return (
    <GrantContext.Provider value={{ applied, apply }}>
      {children}
    </GrantContext.Provider>
  );
}

export function useGrant() {
  const context = useContext(GrantContext);
  if (!context) throw new Error("useGrant must be used inside Provider");
  return context;
}