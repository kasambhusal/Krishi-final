"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import ScrollToTop from "../ChildComponent/Others/ScrollToTop";

export default function ClientSideNav() {
  const [isNav, setIsNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNav(!pathname.includes("/dashboard"));
  }, [pathname]);

  if (!isNav) return null;

  return (
    <>
      <Navigation /> <ScrollToTop />
    </>
  );
}
