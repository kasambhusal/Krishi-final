"use client";
import React, { useEffect, useState } from "react";
import AuthorBredCrumb from "../Others/AuthorBredCrumb";
import { useNews } from "../../Context/NewsContext";
import Link from "next/link";
import { useTheme } from "../../Context/ThemeContext";
import FormatNepaliDate from "../../JS/FormatNepaliDate";
import { Skeleton } from "@mui/material";
import Image from "next/image"; // Import next/image

const Hero = ({ lge = "np", order }) => {
  const [news, setNews] = useState(null);
  const [nepaliDate, setNepaliDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const { loading, wholeNews } = useNews();
  const { themeColor } = useTheme();

  // Scroll to top function
  // const scrollToTop = () => {
  //   if (typeof window !== "undefined") {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (wholeNews.length > 0) {
          const filteredResponse = wholeNews.filter(
            (item) => item.breaking_news === true
          );
          setNews(filteredResponse[order]);
        } else {
          setNews(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNews(null);
      }
    };

    fetchData();
  }, [wholeNews, order]);

  useEffect(() => {
    if (news) {
      if (news.self_date) {
        const englishDateObj = new Date(news.self_date);
        const formattedEnglishDate = `${englishDateObj.getDate()} ${englishDateObj.toLocaleString(
          "default",
          { month: "long" }
        )} ${englishDateObj.getFullYear()}`;
        setEnglishDate(formattedEnglishDate);
        setNepaliDate(FormatNepaliDate(news.self_date));
      } else if (news.created_date_ad && news.created_date_bs) {
        const englishDateObj = new Date(news.created_date_ad);
        const formattedEnglishDate = `${englishDateObj.getDate()} ${englishDateObj.toLocaleString(
          "default",
          { month: "long" }
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
        .split(" ")
        .map((digit) => nepaliDigits[digit])
        .join("");
    };
    const nepaliMonth = nepaliMonths[month - 1];
    const nepaliDay = nepaliNumbers(day);
    const nepaliYear = nepaliNumbers(year);
    return `${nepaliDay} ${nepaliMonth} ${nepaliYear}`;
  };

  const { news_title, news_sub_title, author_name, category_name, image, id } =
    news || {};

  // Ensure the required fields are available before using them in the Link
  const generateHref = () => {
    if (!news) return "#"; // Fallback URL if news is not available

    const datePart =
      lge === "en"
        ? news.created_date_ad?.split("T")[0]?.split("-").join("/")
        : news.created_date_bs?.replace(/-/g, "/");

    if (!datePart || !id || !news_title) return "#"; // Fallback if any necessary data is missing

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
              <div className="text-center my-[10px] w-full flex flex-col gap-[10px]">
                <Link
                  href={generateHref()}
                  // onClick={scrollToTop}
                >
                  <p
                    className="text-3xl sm:text-5xl font-bold max-w-[90%] mx-auto  line-clamp-3 hover:text-[#0c8a30]"
                    style={{
                      // overflowWrap: "break-word", // Ensure long words are wrapped only when necessary
                      // wordBreak: "normal", // Prevent breaking words like "book"
                      // whiteSpace: "normal", // Ensure proper line wrapping
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
                    category={category_name}
                    language={lge}
                  />
                )}
              </div>
              <Link
                href={generateHref()}
                className="w-full"
                // onClick={scrollToTop}
              >
                <div className="w-full flex justify-center">
                  {image ? (
                    <Image
                      src={image}
                      width={1200} // Provide width for optimization
                      height={650} // Provide height for optimization
                      className="w-[95%] lg:w-[90%] max-h-[650px]"
                      style={{
                        borderRadius: "10px",
                        border: `2px dotted ${themeColor}`,
                      }}
                      alt={news_title} // Use a meaningful alt text
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
