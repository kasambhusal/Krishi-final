"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

const Card7 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [isMobile, setIsMobile] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) =>
        (item.category_name === myWord || item.sub_category === myWord) &&
        item.active === true
      // &&          item.image != null
    );
    // .sort((a, b) => b.id - a.id); // Sorting in descending order by id

    setNews(filteredResponse);
  }, [wholeNews, myWord]); // Added wholeNews as a dependency

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
        <div className="flex flex-col gap-[30px] my-10">
          <div className="flex flex-col sm:flex-row gap-10">
            {news.slice(0, 3).map((item) => (
              <SmallCardContentBottom
                key={item.id}
                id={item.id}
                title={item.news_title}
                sub_title={item.news_sub_title}
                lineClampTitle={2}
                lineClampDes={2}
                textBlack={true}
                showParagraph={false}
                showDate={false}
                created_date_ad={item.created_date_ad}
                created_date_bs={item.created_date_bs}
              />
            ))}
          </div>

          {!isMobile && (
            <div className="flex w-full gap-10 flex-col sm:flex-row items-center">
              {news.slice(3, 6).map((item) => (
                <SmallCardContentBottom
                  key={item.id}
                  id={item.id}
                  title={item.news_title}
                  sub_title={item.news_sub_title}
                  lineClampTitle={2}
                  lineClampDes={2}
                  textBlack={true}
                  showParagraph={false}
                  showDate={false}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[60vh] flex justify-center items-center">
          <p>
            {" "}
            <Spin size="large" />{" "}
          </p>
        </div>
      )}
    </>
  );
};

export default Card7;
