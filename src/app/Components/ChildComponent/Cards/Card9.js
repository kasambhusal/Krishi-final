"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card9 = ({ myWord }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/news/get-news-by-category?q=${encodeURIComponent(myWord)}&language=${lge}&limit=3`,
        });

        setNews(response.results || []);
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
          <div className="w-full">
            <div className="flex flex-col gap-[30px] my-10">
              <div className="flex flex-col items-center sm:flex-row gap-10">
                {news.map((item) => (
                  <div key={item.id} className="w-[90%] lg:w-[32%] ">
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
        </div>
      ) : (
        <div className="h-[60vh] text-center">No news available!</div>
      )}
    </>
  );
};

export default Card9;
