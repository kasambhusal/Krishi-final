"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import TrendingNewsBox from "./TrendingNewsBox";
import Breadcrumb from "../Others/Breadcrumb";
import { useTheme } from "../../Context/ThemeContext";
import { useNews } from "../../Context/NewsContext";
import { useCount } from "../../Context/CountContext";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  const { themeColor } = useTheme();
  const { wholeNews } = useNews();
  const { count } = useCount();
  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const viewsResponse = await count;
        if (!viewsResponse || !Array.isArray(viewsResponse)) return;

        const sortedViews = viewsResponse.sort(
          (a, b) => b.visit_count - a.visit_count
        );

        const topTitles = sortedViews.map((item) => String(item.title));
        const newsResponse = await wholeNews;

        const trendingData = sortedViews
          .map((view) => {
            const matchingNews = newsResponse.find(
              (news) => String(news.id) === view.title && news.language === lge
            );
            if (
              matchingNews &&
              isWithinLastMonth(matchingNews.created_date_ad)
            ) {
              return {
                id: matchingNews.id,
                created_date_ad: matchingNews.created_date_ad,
                created_date_bs: matchingNews.created_date_bs,
                title: matchingNews.news_title,
                subtitle: matchingNews.news_sub_title,
                image: matchingNews.media_image || matchingNews.image,
              };
            }
            return null;
          })
          .filter((item) => item !== null);

        setTrendingNews(trendingData.slice(0, 5)); // Ensure only 5 items are set
      } catch (error) {
        console.error("Error fetching trending news:", error);
      }
    };

    fetchTrendingNews();
  }, [count, wholeNews, lge]);
  if (!trendingNews) {
    return null;
  }
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
                title={news.title}
                subtitle={news.subtitle}
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
