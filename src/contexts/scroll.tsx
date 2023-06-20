import React, { createContext, useContext, useMemo, useState } from "react";

type ScrollContextValue = {
  lastPos: number
  setPos: (number: number) => void
}

const defaultValue = {} as ScrollContextValue
const ScrollContext = createContext(defaultValue);

export const ScrollContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pos, setPos] = useState(0);
  const value = useMemo(() => ({
    lastPos: pos,
    setPos
  }), [pos, setPos]);
  return (<ScrollContext.Provider value={value}>{ children }</ScrollContext.Provider>)
}

export const useScrollContext = () => useContext(ScrollContext);

export default { ScrollContextProvider, useScrollContext };
