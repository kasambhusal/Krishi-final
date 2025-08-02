"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../Context/ThemeContext";
import { Get } from "../Redux/API";
import FormatNepaliDate from "../JS/FormatNepaliDate";
import FormatEnglishDate from "../JS/FormatEnglishDate";
import Ads from "../ChildComponent/Advertisement/Ads";
import Share from "../ChildComponent/Others/Share";
import AuthorBredCrumb from "../ChildComponent/Others/AuthorBredCrumb";
import RoadBlocking from "../ChildComponent/Advertisement/RoadBlocking";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import Card10 from "../ChildComponent/Cards/Card10";
import ArticleContent from "../ChildComponent/Others/ArticleContent";
import StorySideBar from "../ChildComponent/Others/StorySideBar";
import { useNavigation } from "../Context/NavigationContext";

const Story = ({ news }) => {
  const { bgColor } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const [shareCount, setShareCount] = useState(0);
  const { lge } = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setNepaliDate(FormatNepaliDate(news.self_date));
    setEnglishDate(FormatEnglishDate(news.self_date));
  }, [news.self_date]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
    const newsElement = document.querySelector(".news-content");
    if (newsElement) {
      const newsRect = newsElement.getBoundingClientRect();
      const hasScrolled = window.scrollY > 300;
      setIsVisible(
        hasScrolled &&
          newsRect.top <= window.innerHeight &&
          newsRect.bottom >= 0
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchAndPostViews = async () => {
      try {
        const response = await Get({
          url: `/count/posts/${news.id}/`,
        });
        setShareCount(response.shares[0]?.share_count);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    fetchAndPostViews();
  }, [news.id]);

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      {isVisible && (
        <div className="fixed top-[150px] left-[2%] z-50 hidden md:block">
          <Share
            newsTitle={news.news_title}
            id={news.id}
            shareCount={shareCount}
            vertical={true}
          />
        </div>
      )}

      <div className="flex flex-col justify-center w-[97%] sm:w-[90%]">
        <RoadBlocking name="S_roadblocking_ads" />
        <Ads name="S_landscape_before_title" />

        <span
          className={`text-${
            scrolled
              ? "2xl pl-3 mt-[30px] md:text-3xl shadow-lg"
              : "3xl md:text-5xl"
          } 
          duration-[1s] font-bold sticky top-[59px] z-10 p-2`}
          style={{
            lineHeight: "1.5",
            transition: "font-size 0.2s ease-in-out",
            backgroundColor: bgColor,
          }}
        >
          <h1
            className="w-full break-words mt-[20px]"
            style={{
              overflowWrap: "break-word", // Ensure long words are wrapped only when necessary
              wordBreak: "normal", // Prevent breaking words like "book"
              whiteSpace: "normal", // Ensure proper line wrapping
            }}
          >
            {news.news_title}
          </h1>
        </span>

        {news.news_sub_title && (
          <h2 className="text-2xl pl-3 my-3 w-full text-[#4f4f4f]">
            {news.news_sub_title}
          </h2>
        )}

        <div className="flex flex-col w-full items-center gap-12 py-4 mt-8 mb-5">
          <div className="w-full flex flex-wrap justify-between sm:px-5">
            <AuthorBredCrumb
              id={news.author_name}
              englishDate={englishDate}
              nepaliDate={nepaliDate}
              category={news.category_names[0]}
              language={news.language}
            />
            <span className="flex gap-[15px] justify-end w-full lg:w-auto">
              <Share
                newsTitle={news.news_title}
                id={news.id}
                shareCount={shareCount}
              />
            </span>
          </div>
        </div>

        <Ads name="S_landscape_after_title" />

        <div className="w-full grid grid-cols-11">
          <div className="col-span-11 xl:col-span-7 w-full h-full">
            <ArticleContent news={news} />
            <div className="my-5">
              <Share
                newsTitle={news.news_title}
                id={news.id}
                shareCount={shareCount}
              />
            </div>
            <Ads name="S_landscape_after_content" />
            <div className="mt-6">
              <Breadcrumb
                showLinks={false}
                addNews={false}
                myWord={lge === "en" ? "Related News" : "सम्बन्धित खबर"}
              />
              <Card10 myWord={news.category_names[0]} id={news.id} />
            </div>
          </div>
          <StorySideBar />
        </div>
      </div>
    </div>
  );
};

export default Story;
