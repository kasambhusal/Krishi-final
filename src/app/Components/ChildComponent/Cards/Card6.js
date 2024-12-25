"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentRight from "../Boxes/SmallCardContentRight";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

const Card6 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [phone, setPhone] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) => item.category_name === myWord || item.sub_category === myWord
      // &&        item.image != null
    );

    setNews(filteredResponse);
  }, [wholeNews, myWord]); // Added wholeNews as a dependency

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setPhone(window.innerWidth < 640);
      }
    };

    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize); // Add event listener
      return () => {
        window.removeEventListener("resize", handleResize); // Cleanup
      };
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-2 my-5">
          <div
            className="col-span-2 sm:col-span-1 flex flex-col gap-0 sm:gap-8"
            style={{ padding: "0 15px" }}
          >
            {news.slice(0, 2).map((item) => (
              <div key={item.id} className="h-[120px] my-[5px]">
                <SmallCardContentRight
                  id={item.id}
                  title={item.news_title}
                  sub_title={item.news_sub_title}
                  image={item.image || item.media_image}
                  textBlack={true}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              </div>
            ))}
          </div>
          {/* {!phone && ( */}
          <div
            className="col-span-2 sm:col-span-1 flex flex-col gap-1 sm:gap-8"
            style={{ padding: "0 15px" }}
          >
            {news.slice(2, 4).map((item) => (
              <div key={item.id} className="h-[120px] my-[5px]">
                <SmallCardContentRight
                  id={item.id}
                  title={item.news_title}
                  sub_title={item.news_sub_title}
                  image={item.image || item.media_image}
                  textBlack={true}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              </div>
            ))}
          </div>
          {/* )} */}
        </div>
      ) : (
        <div className="h-[60vh] text-center"></div>
      )}
    </>
  );
};

export default Card6;
