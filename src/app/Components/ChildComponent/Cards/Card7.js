"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card7 = ({ myWord }) => {
  const [isMobile, setIsMobile] = useState(false);
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
                image={item.media_image || item.image}
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
                  image={item.media_image || item.image}
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
          No news available!
        </div>
      )}
    </>
  );
};

export default Card7;
