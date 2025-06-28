"use client";
import { useEffect, useState } from "react";
import AuthorBredCrumb from "../Others/AuthorBredCrumb";
import Link from "next/link";
import { useTheme } from "../../Context/ThemeContext";
import FormatNepaliDate from "../../JS/FormatNepaliDate";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { Get } from "../../Redux/API";

const Hero = ({ lge = "np", order }) => {
  const [news, setNews] = useState(null);
  const [nepaliDate, setNepaliDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const { themeColor } = useTheme();
  const [loading, setLoading] = useState(false);

  // Generate cache key based on parameters
  const getCacheKey = () => `hero_news_${lge}_${order}`;

  // Get data from session storage
  const getCachedData = () => {
    try {
      const cached = sessionStorage.getItem(getCacheKey());
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error reading from session storage:", error);
      return null;
    }
  };

  // Save data to session storage
  const setCachedData = (data) => {
    try {
      sessionStorage.setItem(
        getCacheKey(),
        JSON.stringify({
          news: data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error saving to session storage:", error);
    }
  };

  // Check if cached data is still valid (optional: add expiration)
  const isCacheValid = (cachedData) => {
    if (!cachedData) return false;

    // Optional: Add cache expiration (e.g., 30 minutes)
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;

    return !isExpired;
  };

  useEffect(() => {
    const fetchData = async () => {
      // First, check if we have cached data
      const cachedData = getCachedData();

      if (cachedData && isCacheValid(cachedData)) {
        setNews(cachedData.news);
        return;
      }

      // If no valid cache, fetch from API
      try {
        setLoading(true);

        const response = await Get({
          url: `/public/news/get-news?language=${lge}&breaking_news=true&limit=1&offset=${order}`,
        });

        const newsData = response.results[0] || null;
        setNews(newsData);

        // Cache the fetched data
        if (newsData) {
          setCachedData(newsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNews(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [order, lge]);

  // Function to manually refresh data (optional)
  const refreshData = async () => {
    // Clear cache for this specific key
    sessionStorage.removeItem(getCacheKey());

    try {
      setLoading(true);
      const response = await Get({
        url: `/public/news/get-news?language=${lge}&breaking_news=true&limit=1&offset=${order}`,
      });

      const newsData = response.results[0] || null;
      setNews(newsData);

      if (newsData) {
        setCachedData(newsData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNews(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (news) {
      if (news.self_date) {
        const englishDateObj = new Date(news.self_date);
        const formattedEnglishDate = `${englishDateObj.getDate()} ${englishDateObj.toLocaleString(
          "default",
          {
            month: "long",
          }
        )} ${englishDateObj.getFullYear()}`;
        setEnglishDate(formattedEnglishDate);
        setNepaliDate(FormatNepaliDate(news.self_date));
      } else if (news.created_date_ad && news.created_date_bs) {
        const englishDateObj = new Date(news.created_date_ad);
        const formattedEnglishDate = `${englishDateObj.getDate()} ${englishDateObj.toLocaleString(
          "default",
          {
            month: "long",
          }
        )} ${englishDateObj.getFullYear()}`;
        setEnglishDate(formattedEnglishDate);
        setNepaliDate(convertToNepaliDate(news.created_date_bs));
      }
    }
  }, [news]);

  const convertToNepaliDate = (dateString) => {
    if (!dateString) return "";
    const nepaliMonths = [
      "बैशाख",
      "ज्येष्ठ",
      "आषाढ",
      "साउन",
      "भाद्र",
      "आश्विन",
      "कार्तिक",
      "मंसिर",
      "पौष",
      "माघ",
      "फागुन",
      "चैत",
    ];
    const [year, month, day] = dateString.split("-").map(Number);
    const nepaliNumbers = (num) => {
      const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
      return num
        .toString()
        .split("")
        .map((digit) => nepaliDigits[digit])
        .join("");
    };
    const nepaliMonth = nepaliMonths[month - 1];
    const nepaliDay = nepaliNumbers(day);
    const nepaliYear = nepaliNumbers(year);
    return `${nepaliDay} ${nepaliMonth} ${nepaliYear}`;
  };

  const { news_title, news_sub_title, author_name, category_names, image, id } =
    news || {};

  const generateHref = () => {
    if (!news) return "#";

    const datePart =
      lge === "en"
        ? news.created_date_ad?.split("T")[0]?.split("-").join("/")
        : news.created_date_bs?.replace(/-/g, "/");

    if (!datePart || !id || !news_title) return "#";

    return lge === "en"
      ? `/en/story/${datePart}/${id}/${news_title}`
      : `/story/${datePart}/${id}`;
  };

  return (
    <div className="font-mukta mt-[50px]">
      {loading ? (
        <div className="w-full h-[100vh] gap-[20px] flex flex-col justify-center items-center">
          <div className="w-[90%] flex gap-[10px] flex-col items-center">
            <Skeleton variant="rectangular" width="80%" height={60} />
            <Skeleton variant="rectangular" width="30%" height={40} />
            <Skeleton variant="rectangular" width="40%" height={50} />
          </div>
          <Skeleton variant="rectangular" width="90%" height="80vh" />
        </div>
      ) : (
        <>
          {news ? (
            <div
              className={`my-1 flex flex-col items-center gap-[50px] cursor-pointer`}
            >
              {/* Optional: Add refresh button for manual refresh */}
              <button
                onClick={refreshData}
                className="hidden" // Hide by default, show only if needed
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "5px 10px",
                  background: themeColor,
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>

              <div className="text-center my-[10px] w-full flex flex-col gap-[10px]">
                <Link href={generateHref()}>
                  <p
                    className="text-3xl sm:text-5xl font-bold max-w-[90%] mx-auto line-clamp-3 hover:text-[#0c8a30]"
                    style={{
                      lineHeight: "1.5",
                    }}
                  >
                    {news_title}
                  </p>
                  <p className="max-w-[80%] mx-auto py-1 sm:w-[50%] text-[20px] sm:text-[22px] text-[#6f7370] line-clamp-1">
                    {news_sub_title}
                  </p>
                </Link>
                {author_name && englishDate && nepaliDate && (
                  <AuthorBredCrumb
                    id={author_name}
                    englishDate={englishDate}
                    nepaliDate={nepaliDate}
                    category={category_names[0]}
                    language={lge}
                  />
                )}
              </div>
              <Link href={generateHref()} className="w-full">
                <div className="w-full flex justify-center">
                  {image ? (
                    <Image
                      src={image || "/placeholder.svg"}
                      width={1200}
                      height={650}
                      className="w-[95%] lg:w-[90%] max-h-[650px]"
                      style={{
                        borderRadius: "10px",
                        border: `2px dotted ${themeColor}`,
                      }}
                      priority
                      alt={news_title}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="w-full h-[100vh] gap-[20px] flex flex-col justify-center items-center">
              <div className="w-[90%] flex gap-[10px] flex-col items-center">
                <Skeleton variant="rectangular" width="80%" height={60} />
                <Skeleton variant="rectangular" width="30%" height={40} />
                <Skeleton variant="rectangular" width="40%" height={50} />
              </div>
              <Skeleton variant="rectangular" width="90%" height="80vh" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Hero;
