"use client";
import React, { useEffect, useState } from "react";
import SmallCardContentRight from "../Boxes/SmallCardContentRight";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Card6 = ({ myWord }) => {
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
                  image={item.media_image || item.image}
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
        <div className="h-[60vh] text-center">No news available!</div>
      )}
    </>
  );
};

export default Card6;
