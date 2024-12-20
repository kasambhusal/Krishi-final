"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

const Card9 = ({ myWord }) => {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [isMobile, setIsMobile] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) =>
        (item.category_name === myWord || item.sub_category === myWord) &&
        item.active === true
      //  &&          item.image != null
    );
    // console.log(filteredResponse);
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
        <div className="w-full">
          <div className="w-full">
            <div className="flex flex-col gap-[30px] my-10">
              <div className="flex flex-col items-center sm:flex-row gap-10">
                {news.slice(0, 3).map((item) => (
                  <div key={item.id} className="w-[90%] lg:w-[32%] ">
                    <SmallCardContentBottom
                      id={item.id}
                      image={item.image}
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
              {/* {!isMobile && news[3] && (
                <div className="flex gap-10 flex-col sm:flex-row">
                  <SmallCardContentBottom
                    key={news[3].id} // Unique key
                    lineClampTitle={2}
                    lineClampDes={2}
                    textBlack={true}
                    showParagraph={false}
                    showDate={false}
                    title={news[3].news_title}
                    sub_title={news[3].news_sub_title}
                    created_date_ad={news[3].created_date_ad}
                    created_date_bs={news[3].created_date_bs}
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] text-center"></div>
      )}
    </>
  );
};

export default Card9;
