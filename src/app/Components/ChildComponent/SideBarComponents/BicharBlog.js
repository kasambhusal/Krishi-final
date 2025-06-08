"use client";
import React, { useEffect, useState } from "react";
import BicharBlogBox from "./BicharBlogBox";
import Breadcrumb from "../Others/Breadcrumb";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

// Define Nepali numbers
const nepaliNumbers = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const toNepaliNumber = (num) => {
  return String(num)
    .split("")
    .map((digit) => nepaliNumbers[Number(digit)] || digit)
    .join("");
};

const BicharBlog = () => {
  const [filteredNews, setFilteredNews] = useState([]);
  const { lge } = useNavigation(); // Get the current language from context
  const myWord = lge === "en" ? "Opinion" : "खानपान";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/news/get-news-by-category?q=${encodeURIComponent(myWord)}&language=${lge}&limit=4`,
        });
        setFilteredNews(response.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredNews([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [lge, myWord]);
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
