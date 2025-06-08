"use client";
import React, { useEffect, useState } from "react";
import TajaSamacharBox from "./TajaSamacharBox";
import Breadcrumb from "../Others/Breadcrumb";
import { useTheme } from "../../Context/ThemeContext";
import { Skeleton } from "@mui/material";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const toNepaliNumber = (num) => {
  return String(num)
    .split("")
    .map((digit) => nepaliNumbers[Number(digit)])
    .join("");
};

export default function TajaSamachar() {
  const { themeColor } = useTheme();
  const [loading, setLoading] = useState(true);
  const [filteredNews, setFilteredNews] = useState([]);
  const { lge } = useNavigation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await Get({
          url: `/public/news/get-news?language=${lge}&limit=6&offset=0`,
        });
        setFilteredNews(response.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNews();
  }, [lge]);

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
      {loading ? (
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
