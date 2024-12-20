"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
export default function ClientSideNav() {
  const [isNav, setIsNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsNav(!pathname.includes("/dashboard"));
  }, [pathname]);

  if (isNav) return null;

  return <Footer />;
}
