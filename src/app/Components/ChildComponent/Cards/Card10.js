"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card10 = ({ myWord, id }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/news/get-news-by-category?q=${encodeURIComponent(myWord)}&language=${lge}&limit=7`,
        });
        const filteredResponse = response.results.filter(
          (item) => item.id != id
        );
        setNews(filteredResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNews([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [lge, myWord]);

  return (
    <>
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="w-full">
          <div className="w-full flex justify-center">
            <div className="w-[85%] lg:w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {news.slice(0, 6).map((item) => (
                <div key={item.id} className="w-full">
                  <SmallCardContentBottom
                    id={item.id}
                    image={item.media_image || item.image}
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
        <div className="h-[60vh] text-center">No news available!</div>
      )}
    </>
  );
};

export default Card10;
