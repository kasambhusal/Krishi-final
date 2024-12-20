"use client";
import React, { useEffect, useState } from "react";
import TajaSamacharBox from "./TajaSamacharBox";
import { useNews } from "../../Context/NewsContext";
import Breadcrumb from "../Others/Breadcrumb";
import { useTheme } from "../../Context/ThemeContext";
import { Skeleton } from "@mui/material";
import { usePathname } from "next/navigation";

const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const toNepaliNumber = (num) => {
  return String(num)
    .split("")
    .map((digit) => nepaliNumbers[Number(digit)])
    .join("");
};

export default function TajaSamachar() {
  const { themeColor } = useTheme();
  const pathname = usePathname();
  const { wholeNews, loading: newsLoading } = useNews(); // Fetch news and loading state from context
  const [filteredNews, setFilteredNews] = useState([]);
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  useEffect(() => {
    const filteredResponse = wholeNews;

    setFilteredNews(filteredResponse);
  }, [wholeNews, lge]); // Re-run when wholeNews or lge changes

  return (
    <div
      style={{
        padding: "5px 15px",
        borderRadius: "5px",
      }}
    >
      <Breadcrumb
        myWord={lge === "en" ? "Recent news" : "ताजा समाचार"}
        addNews={false}
      />
      {newsLoading ? (
        <div className="flex flex-col items-center my-4 gap-[5px]">
          <Skeleton variant="rectangular" width="90%" height={60} />
          <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
          <Skeleton variant="rectangular" width="90%" height={60} />
          <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
          <Skeleton variant="rectangular" width="90%" height={60} />
          <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
          <Skeleton variant="rectangular" width="90%" height={60} />
          <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
          <Skeleton variant="rectangular" width="90%" height={60} />
          <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
          <Skeleton variant="rectangular" width="90%" height={60} />
          {/* <hr className="bg-[#d1d1cf] mx-2 h-[2px]" /> */}
        </div>
      ) : (
        filteredNews.slice(0, 6).map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="grid grid-cols-7 gap-[5px]">
              <div className="col-span-1 flex justify-center items-center">
                <span
                  className=" text-white font-bold border w-[30px] h-[30px] flex justify-center items-center"
                  style={{
                    backgroundColor: themeColor,
                    borderRadius: "100%",
                  }}
                >
                  {lge === "en" ? index + 1 : toNepaliNumber(index + 1)}
                </span>
              </div>
              <div className="col-span-6">
                <TajaSamacharBox
                  title={item.news_title}
                  id={item.id}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              </div>
            </div>
            {index < 5 && <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />}
          </React.Fragment>
        ))
      )}
    </div>
  );
}
