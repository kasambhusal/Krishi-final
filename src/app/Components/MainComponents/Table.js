"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import Card3 from "../ChildComponent/Cards/Card3";
import { useTheme } from "../Context/ThemeContext";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";

export default function Table() {
  const pathname = usePathname();
  const { bgColor } = useTheme();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  return (
    <div
      className="flex justify-center w-full pt-5"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]  flex flex-col">
        <div className="mb-10 grid grid-cols-6">
          <div className="col-span-6 md:col-span-4">
            <Breadcrumb
              showLinks={false}
              myWord={lge === "en" ? "Market" : "बजार"}
            />
            <Card3 myWord={lge === "en" ? "Market" : "बजार"} />
          </div>
          <div className="col-span-6 md:col-span-2">
            <TajaSamachar />
          </div>
        </div>
        <iframe
          src="https://nepalicalendar.rat32.com/vegetable/embed.php"
          frameBorder="0"
          scrolling="no"
          style={{
            border: "none",
            overflow: "hidden",
            width: "100%",
            height: "3000px", // Ensure height is sufficient for content
            borderRadius: "5px",
            padding: "0",
            margin: "0",
          }}
          allowtransparency="true"
        ></iframe>
      </div>
    </div>
  );
}
