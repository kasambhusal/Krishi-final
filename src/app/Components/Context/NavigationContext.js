"use client";
import { usePathname } from "next/navigation";
import { createContext, useState, useContext, useEffect, useRef } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  const [user, setUser] = useState({ name: "" });

  const lastLgeRef = useRef(lge); // for avoiding unnecessary updates

  // Load user name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("User_name");
    if (storedName) {
      setUser({ name: storedName });
    }
  }, []);

  // Check lge from pathname every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPath = window.location.pathname;
      const newLge = currentPath.includes("/en") ? "en" : "np";

      if (newLge !== lastLgeRef.current) {
        lastLgeRef.current = newLge;
        setLge(newLge);
        console.log("🌐 Language updated to:", newLge);
      }
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  const setUserName = (name) => {
    setUser((prevUser) => ({ ...prevUser, name }));
  };

  return (
    <NavigationContext.Provider value={{ lge, setLge, user, setUserName }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
