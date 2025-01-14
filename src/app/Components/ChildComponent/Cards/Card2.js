"use client";
import React, { useEffect, useState } from "react";
import BigCardContentUnderImage from "../Boxes/BigCardContentUnderImage";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext";

const Card2 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) => item.category_names.includes(myWord)
      // && item.image != null
    );

    if (filteredResponse.length > 0) {
      setNews(filteredResponse);
    } else {
      const subCategoryFiltered = wholeNews.filter(
        (item) =>
          item.sub_category_names.includes(myWord)
          // (item.image || item.media_image) != null
      );
      // .sort((a, b) => b.id - a.id);
      setNews(subCategoryFiltered);
    }
  }, [wholeNews, myWord]); // Added wholeNews as a dependency

  return (
    <div className="w-full h-[auto]">
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="w-full h-full flex flex-wrap gap-10 justify-center">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="h-[250px] sm:h-[320px] w-[95%] lg:w-[45%] xl:w-[30%]"
            >
              <BigCardContentUnderImage
                id={item.id}
                title={item.news_title}
                sub_title={item.news_sub_title}
                image={item.media_image || item.image}
                isRounded={true}
                isShadow={true}
                created_date_ad={item.created_date_ad}
                created_date_bs={item.created_date_bs}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 h-[60vh]"></div>
      )}
    </div>
  );
};

export default Card2;
