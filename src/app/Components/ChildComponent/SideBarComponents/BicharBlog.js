"use client";
import React, { useEffect, useState } from "react";
import BicharBlogBox from "./BicharBlogBox";
import { useNews } from "../../Context/NewsContext";
import Breadcrumb from "../Others/Breadcrumb";
import { usePathname } from "next/navigation";

// Define Nepali numbers
const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const toNepaliNumber = (num) => {
  return String(num)
    .split("")
    .map((digit) => nepaliNumbers[Number(digit)] || digit)
    .join("");
};

const BicharBlog = () => {
  const { wholeNews } = useNews(); // Fetch news from context
  const [filteredNews, setFilteredNews] = useState([]);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // Loading state
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  useEffect(() => {
    const filterNews = () => {
      const news = wholeNews.filter((item) =>
        item.category_names.includes(lge === "en" ? "Opinion" : "खानपान")
      );
      setFilteredNews(news.slice(0, 5)); // Limit to 4 items
      setLoading(false); // Set loading to false after filtering
    };

    if (wholeNews.length) {
      filterNews();
    } else {
      setLoading(true); // Set loading while waiting for news
    }
  }, [wholeNews, lge]); // <-- Added `lge` to the dependency array

  return (
    <div className="flex flex-col gap-5 w-full" style={{ padding: "5px 5px" }}>
      {filteredNews.length > 0 && (
        <Breadcrumb
          myWord={lge === "en" ? "Opinion" : "स्वस्थ खानपान"}
          addNews={false}
        />
      )}

      <div className="flex flex-col gap-1 my-1">
        {loading ? (
          <div className="flex justify-center my-4"></div>
        ) : (
          filteredNews.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex items-center">
                <div className="w-full">
                  <BicharBlogBox
                    title={item.news_title}
                    image={item.media_image || item.image}
                    id={item.id}
                    created_date_ad={item.created_date_ad}
                    created_date_bs={item.created_date_bs}
                  />
                </div>
              </div>
              {index < filteredNews.length - 1 && (
                <hr className="bg-[#d1d1cf] mx-2 h-[2px]" />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default BicharBlog;
