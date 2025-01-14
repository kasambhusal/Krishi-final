"use client";
import React, { useEffect, useState } from "react";
import BigCardContentUnderImage from "../Boxes/BigCardContentUnderImage";
import SmallCardContentRight from "../Boxes/SmallCardContentRight";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext";
import { useTheme } from "../../Context/ThemeContext";

const Card1 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [news, setNews] = useState([]);
  const { themeColor } = useTheme();
  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) => item.category_names.includes(myWord)
      // && item.image != null
    );
    if (filteredResponse.length > 0) {
      setNews(filteredResponse);
    } else {
      const subCategoryFiltered = wholeNews.filter(
        (item) => item.sub_category_names.includes(myWord) && item.active === true
        // (item.image || item.media_image) != null
      );
      // .sort((a, b) => b.id - a.id);
      setNews(subCategoryFiltered);
    }
  }, [wholeNews, myWord]); // Added wholeNews as a dependency

  return (
    <div>
      <div
        className={`h-[auto]  md:h-[450px] w-full flex flex-col sm:flex-row justify-start gap-10 my-10  p-9`}
        style={{
          backgroundColor: themeColor,
          borderRadius: "5px",
        }}
      >
        <div className="w-full md:w-1/2 h-[250px] sm:h-auto">
          {loading ? (
            <div>
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div> // Fallback for loading state
          ) : news.length > 0 ? (
            <BigCardContentUnderImage
              id={news[0].id}
              title={news[0].news_title}
              sub_title={news[0].news_sub_title}
              image={news[0].media_image || news[0].image}
              created_date_ad={news[0].created_date_ad}
              created_date_bs={news[0].created_date_bs}
            />
          ) : (
            <div></div> // Fallback for
          )}
        </div>
        <div className="w-full md:w-1/2 flex h-[320px] sm:h-full gap-5 flex-col ">
          {loading ? (
            <div className="h-[60vh] flex justify-center items-center">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div> // Fallback for loading state
          ) : news.length > 1 ? (
            news
              .slice(1, 4)
              .map((item) => (
                <SmallCardContentRight
                  key={item.id}
                  id={item.id}
                  title={item.news_title}
                  sub_title={item.news_sub_title}
                  image={item.media_image || item.image}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              ))
          ) : (
            <div className="h-[60vh]"> </div> // Fallback for no additional news
          )}
        </div>
      </div>
    </div>
  );
};

export default Card1;
