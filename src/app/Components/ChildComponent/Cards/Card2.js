"use client";
import React, { useEffect, useState } from "react";
import BigCardContentUnderImage from "../Boxes/BigCardContentUnderImage";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card2 = ({ myWord }) => {
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
    <div className="w-full h-[auto]">
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="w-full h-full flex flex-wrap gap-10 justify-center">
          {news.map((item) => (
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
        <div className="text-center py-4 h-[60vh]"> No news available!</div>
      )}
    </div>
  );
};

export default Card2;
