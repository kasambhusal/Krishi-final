"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import BigCardContentRight from "../ChildComponent/Boxes/BigCardContentRight";
import SmallCardContentBottom from "../ChildComponent/Boxes/SmallCardContentBottom";
import { Button } from "antd";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import NotFound from "../ErrorPage/NotFound";
import { useNews } from "../Context/NewsContext";
import { useTheme } from "../Context/ThemeContext";
import { Get } from "../Redux/API";

const CategoryPage = ({ categoryName, isValidCategory }) => {
  const [visibleCount, setVisibleCount] = useState(11);
  const [filteredNews, setFilteredNews] = useState([]);
  const { wholeNews, loading, setWholeNews } = useNews();
  const { bgColor } = useTheme();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLocalLoading(true);

      if (!wholeNews.length) {
        try {
          const newsData = await Get({ url: "/public/news/get-news" });
          setWholeNews(newsData);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      }

      // Wait for wholeNews to be populated
      if (wholeNews.length > 0) {
        const filtered = wholeNews.filter(
          (item) =>
            item.category_name === categoryName ||
            item.sub_category === categoryName
        );
        setFilteredNews(filtered);
        setLocalLoading(false);
      }
    };

    fetchNews();
  }, [categoryName, wholeNews, isValidCategory, setWholeNews]);

  useEffect(() => {
    const scrollToTop = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
    scrollToTop();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (!isValidCategory) {
    return <NotFound />;
  }

  const renderLoadingState = () => (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]">
        <div className="w-full grid grid-cols-6 mt-10">
          <div className="col-span-6 md:col-span-4 px-3">
            <Breadcrumb
              showLinks={false}
              myWord={categoryName}
              addNews={false}
            />
            <Skeleton variant="rectangular" width="80%" height="60vh" />
          </div>
          <div className="col-span-6 md:col-span-2 mt-10">
            <div className="sticky top-[60px]">
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || localLoading || wholeNews.length === 0) {
    return renderLoadingState();
  }

  if (filteredNews.length === 0) {
    return renderLoadingState();
  }

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]">
        <div className="w-full grid grid-cols-6 mt-10">
          <div className="col-span-6 md:col-span-4 px-3">
            <Breadcrumb
              showLinks={false}
              myWord={categoryName}
              addNews={false}
            />
            <div className="mt-4">
              <BigCardContentRight
                showParagraph={true}
                id={filteredNews[0].id}
                title={filteredNews[0].news_title}
                sub_title={filteredNews[0].news_sub_title}
                image={filteredNews[0].image}
                created_date_ad={filteredNews[0].created_date_ad}
                created_date_bs={filteredNews[0].created_date_bs}
              />
              <div className="flex flex-wrap justify-evenly gap-[15px] sm:gap-[30px] mys-4">
                {filteredNews.slice(1, visibleCount).map((item) => (
                  <div
                    key={item.id}
                    className="w-[95%] sm:w-[80%] xl:w-[40%]  pb-4 pt-2 px-3 bg-green-100 rounded-md"
                    style={{
                      boxShadow: "0px 0px 10px #a8a4a3",
                    }}
                  >
                    <SmallCardContentBottom
                      lineClampTitle={2}
                      lineClampDes={2}
                      textBlack={true}
                      showParagraph={false}
                      showDate={false}
                      title={item.news_title}
                      sub_title={item.news_sub_title}
                      image={item.image}
                      id={item.id}
                      created_date_ad={item.created_date_ad}
                      created_date_bs={item.created_date_bs}
                    />
                  </div>
                ))}
              </div>
              {visibleCount < filteredNews.length && (
                <button
                  onClick={handleLoadMore}
                  type="primary"
                  block
                  className="w-full py-1 mb-2  bg-green-500 text-white hover:bg-green-800"
                  style={{ borderRadius: "5px" }}
                >
                  Load More
                </button>
              )}
            </div>
          </div>
          <div className="col-span-6 md:col-span-2 mt-10">
            <div className="sticky top-[60px]">
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
