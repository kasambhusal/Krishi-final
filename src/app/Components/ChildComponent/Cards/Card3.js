"use client";
import React, { useEffect, useState } from "react";
import BigCardContentRight from "../Boxes/BigCardContentRight";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

const Card3 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [news, setNews] = useState([]);
  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) => item.category_names.includes(myWord)
      //  && item.image != null
    );

    if (filteredResponse.length > 0) {
      setNews(filteredResponse);
    } else {
      const subCategoryFiltered = wholeNews.filter(
        (item) => item.sub_category_names.includes(myWord)
        // (item.image || item.media_image) != null
      );
      setNews(subCategoryFiltered);
    }
  }, [wholeNews, myWord]); // Added wholeNews as a dependency

  return (
    <div className="w-[98%] md:w-full">
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="flex flex-col w-full gap-7">
          <div className="w-full">
            <BigCardContentRight
              id={news[0].id}
              title={news[0].news_title}
              sub_title={news[0].news_sub_title}
              image={news[0].media_image || news[0].image}
              showParagraph={true}
              created_date_ad={news[0].created_date_ad}
              created_date_bs={news[0].created_date_bs}
            />
          </div>
          <div className="flex flex-wrap">
            {news.slice(1, 4).map((item, index) => {
              if (!item) return null; // Check if the item exists
              return (
                <div
                  key={item.id || index} // Use item.id for unique key
                  className="w-full sm:w-1/2  lg:w-1/3 p-2" // Adjust width for responsiveness
                >
                  <SmallCardContentBottom
                    id={item.id}
                    title={item.news_title}
                    sub_title={item.news_sub_title}
                    image={item.media_image || item.image}
                    lineClampTitle={2}
                    lineClampDes={2}
                    textBlack={true}
                    showParagraph={false}
                    created_date_ad={item.created_date_ad}
                    created_date_bs={item.created_date_bs}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 h-[60vh]"> No News Available ! </div>
      )}
    </div>
  );
};

export default Card3;
