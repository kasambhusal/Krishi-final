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
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full flex flex-col items-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className={`w-full sm:w-[90%] ${mukta.className}`}>
          <TopNav />
          {/* <div className="mySticky"> */}
          <BottomNav />
        </div>
      </div>
      {/* <div className="w-full flex">
        <div
          className="w-[5%] hidden sm:flex"
          style={{ backgroundColor: bgColor }}
        ></div>
        <div className="w-full sm:w-[90%] ">
          <RateViewer />
        </div>
        <div
          className="w-[5%] hidden sm:flex"
          style={{ backgroundColor: bgColor }}
        ></div>
      </div> */}
    </div>
    
  );
};

export default Navigation;
