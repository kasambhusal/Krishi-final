"use client";
import { usePathname } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";
// Create a Context
const NavigationContext = createContext();

// Create a Provider component
export const NavigationProvider = ({ children }) => {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  // User state with name
  const [user, setUser] = useState({ name: "" });

  // Load user name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("User_name");
    if (storedName) {
      setUser({ name: storedName });
    }
  }, []);

  // Function to update the user name
  const setUserName = (name) => {
    setUser((prevUser) => ({ ...prevUser, name }));
  };
  return (
    <NavigationContext.Provider value={{ lge, setLge, user, setUserName }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for using the context
export const useNavigation = () => useContext(NavigationContext);
