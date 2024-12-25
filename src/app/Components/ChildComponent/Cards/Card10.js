"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

const Card10 = ({ myWord, id }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [isMobile, setIsMobile] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) =>
        (item.category_name === myWord || item.sub_category === myWord) &&
        item.id != id
    );
    setNews(filteredResponse);
  }, [wholeNews, myWord]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize); // Add event listener
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="w-full">
          <div className="w-full flex justify-center">
            <div className="w-[85%] lg:w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
              {news.slice(0, 9).map((item) => (
                <div key={item.id} className="w-full">
                  <SmallCardContentBottom
                    id={item.id}
                    image={item.image || item.media_image}
                    lineClampTitle={2}
                    lineClampDes={2}
                    textBlack={true}
                    showParagraph={false}
                    showDate={false}
                    title={item.news_title}
                    sub_title={item.news_sub_title}
                    created_date_ad={item.created_date_ad}
                    created_date_bs={item.created_date_bs}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] text-center"></div>
      )}
    </>
  );
};

export default Card10;
