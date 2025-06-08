"use client";
import React, { useEffect, useState } from "react";
import BigCardContentRight from "../Boxes/BigCardContentRight";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card5 = ({ myWord }) => {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/news/get-news-by-category?q=${encodeURIComponent(myWord)}&language=${lge}&limit=4`,
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
        <div className="flex flex-col w-full gap-7 my-10">
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
          <div className="  w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
            {news.slice(1, 4).map((item) => {
              if (!item) return null;
              return (
                <SmallCardContentBottom
                  key={item.id}
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
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-[60vh] text-center">
          <p> News not available</p>
        </div>
      )}
    </>
  );
};

export default Card5;
