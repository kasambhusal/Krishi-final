"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import TrendingNewsBox from "./TrendingNewsBox";
import Breadcrumb from "../Others/Breadcrumb";
import { useTheme } from "../../Context/ThemeContext";
import { usePathname } from "next/navigation";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const toNepaliNumber = (num) => {
  return String(num)
    .split("")
    .map((digit) => nepaliNumbers[Number(digit)])
    .join("");
};

const isWithinLastMonth = (dateString) => {
  const oneMonthAgo = dayjs().subtract(1, "month");
  return dayjs(dateString).isAfter(oneMonthAgo);
};

export default function TrendingNews() {
  const { themeColor } = useTheme();
  const [trendingNews, setTrendingNews] = useState([]);

  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/news/get-trending-news?language=${lge}&limit=6`,
        });

        setTrendingNews(response.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTrendingNews([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [lge]);

  return (
    <div className="p-5">
      {trendingNews.length > 0 && (
        <Breadcrumb
          myWord={lge === "en" ? "Trending" : "लोकप्रिय"}
          addNews={false}
        />
      )}
      {trendingNews.map((news, index) => (
        <React.Fragment key={news.id}>
          <div className="grid grid-cols-7 gap-5 my-4">
            <div className="col-span-1 flex justify-center items-center">
              <span
                className="text-white font-bold border w-[30px] h-[30px] flex justify-center items-center"
                style={{
                  backgroundColor: themeColor,
                  borderRadius: "100%",
                }}
              >
                {lge === "en" ? index + 1 : toNepaliNumber(index + 1)}
              </span>
            </div>
            <div className="col-span-6 ">
              <TrendingNewsBox
                id={news.id}
                created_date_ad={news.created_date_ad}
                created_date_bs={news.created_date_bs}
                title={news.news_title}
                subtitle={news.news_sub_title}
                image={
                  news.media_image ||
                  news.image ||
                  "https://cms.krishisanjal.com/media/author/logo_2.jpg"
                }
              />
            </div>
          </div>
          {index < trendingNews.length - 1 && (
            <hr className="bg-[#d1d1cf] mx-2 h-[2px] " />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
