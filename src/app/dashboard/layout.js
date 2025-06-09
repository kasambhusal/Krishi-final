"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationDashboard from "../Components/MainComponents/NavigationDashboard";
import FooterDashboard from "../Components/MainComponents/FooterDashboard";
import { useNavigation } from "../Components/Context/NavigationContext";

const TOKEN_CHECK_INTERVAL = 10000; // Check token every 30 seconds

export default function RootLayout({ children }) {
  const [isNav, setIsNav] = useState(true);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useNavigation();
  // Format pathname for display
  const myLinkFormatted = pathname
    .slice(1)
    .split("/")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("/");

  const isValidToken = (token) => {
    try {
      if (!token || token === "null" || token === "undefined") return false;
      // Additional validation logic can go here, e.g., decoding a JWT
      return true;
    } catch {
      return false; // Return false if parsing or validation fails
    }
  };

  const checkToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("Token");
      const name = localStorage.getItem("User_name");
      if (
        !isValidToken(token) ||
        !name ||
        name === undefined ||
        name === null
      ) {
        localStorage.removeItem("Token"); // Remove invalid token
        localStorage.removeItem("User_name"); // Remove invalid user name
        router.push("/dashboard/login"); // Redirect if token is invalid
      }
    }
  };

  useEffect(() => {
    setIsNav(!pathname.includes("/dashboard/login"));
  }, [pathname]);

  useEffect(() => {
    // Initial token check
    checkToken();

    // Set up periodic token checks
    const intervalId = setInterval(() => {
      checkToken();
    }, TOKEN_CHECK_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="max-w-full flex flex-col items-center bg-green-100">
      <div className="w-[97%] md:w-[90%]">
        {isNav && <NavigationDashboard open={open} setOpen={setOpen} />}
      </div>
      <div className="flex w-[97%] md:w-[90%] flex-col">
        <div className="w-full min-h-[85vh]">
          {isNav && (
            <div className="w-full flex justify-between">
              <h2 className="text-l px-3 my-5">{myLinkFormatted}</h2>
              <h2 className="text-xl px-3 my-5 sm:mr-5 font-bold">
                Hi {user.name ? user.name : "there!"}👋
              </h2>
            </div>
          )}
          <div>{children}</div>
        </div>
        {isNav && <FooterDashboard />}
      </div>
    </div>
  );
}
