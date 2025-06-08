import React, { useEffect, useState } from "react";
import TopNav from "../ChildComponent/Others/TopNav";
import BottomNav from "../ChildComponent/Others/BottomNav";
import { useTheme } from "../Context/ThemeContext";
import { Mukta } from "next/font/google";
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

const Navigation = () => {
  const { bgColor } = useTheme();
  return (
    <div className="w-screen flex flex-col items-center">
      <div
        className="w-full flex flex-col items-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className={`w-full sm:w-[90%] ${mukta.className}`}>
          <TopNav />
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
