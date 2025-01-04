"use client";
import { usePathname } from "next/navigation";
import { createContext, useState, useContext } from "react";
// Create a Context
const NavigationContext = createContext();

// Create a Provider component
export const NavigationProvider = ({ children }) => {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  return (
    <NavigationContext.Provider value={{ lge, setLge }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for using the context
export const useNavigation = () => useContext(NavigationContext);
