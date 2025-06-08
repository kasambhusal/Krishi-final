"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import BigCardContentRight from "../ChildComponent/Boxes/BigCardContentRight";
import SmallCardContentBottom from "../ChildComponent/Boxes/SmallCardContentBottom";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import NotFound from "../ErrorPage/NotFound";
import { useTheme } from "../Context/ThemeContext";
import { Get } from "../Redux/API";
import { useNavigation } from "../Context/NavigationContext";

const CategoryPage = ({
  categoryName,
  isValidCategory,
  initialNews = [],
  hasMore: initialHasMore = false,
  totalCount = 0,
}) => {
  const [filteredNews, setFilteredNews] = useState(initialNews);
  const [offset, setOffset] = useState(initialNews.length);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const { bgColor } = useTheme();
  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();

  const limit = 10; // Items per page

  // Update state when props change (e.g., language change)
  useEffect(() => {
    if (initialNews.length > 0) {
      setFilteredNews(initialNews);
      setOffset(initialNews.length);
      setHasMore(initialHasMore);
    } else if (lge && isValidCategory) {
      // If language changed and we need to refetch
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await Get({
            url: `/public/news/get-news-by-category?q=${encodeURIComponent(categoryName)}&language=${lge}&limit=${limit}&offset=0`,
          });

          const results = response.results || [];
          setFilteredNews(results);
          setOffset(results.length);
          setHasMore(results.length === limit);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setFilteredNews([]);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [lge, categoryName, initialNews, initialHasMore, isValidCategory]);

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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const response = await Get({
        url: `/public/news/get-news-by-category?q=${encodeURIComponent(categoryName)}&language=${lge}&limit=${limit}&offset=${offset}`,
      });

      const newResults = response.results || [];

      if (newResults.length > 0) {
        setFilteredNews((prev) => [...prev, ...newResults]);
        setOffset((prev) => prev + newResults.length);
        setHasMore(newResults.length === limit);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    } catch (error) {
      console.error("Error loading more data:", error);
      setLoadingMore(false);
    }
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

  const renderEmptyState = () => (
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
            <div className="w-full h-[500px] flex items-center justify-center">
              <h1 className="text-red font-bold text-center text-2xl">
                No News available for this category
              </h1>
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

  if (loading) {
    return renderLoadingState();
  }

  if (filteredNews.length === 0) {
    return renderEmptyState();
  }

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]">
        <div className="w-full grid grid-cols-6 mt-10">
          <div className="col-span-6 md:col-span-4 px-3">
            <div>
              <Breadcrumb
                showLinks={false}
                myWord={categoryName}
                addNews={false}
              />
            </div>
            {/* Show total count if available */}
            {totalCount > 0 && (
              <div className="flex justify-end">
                <div className="bg-white  rounded-full shadow-sm border w-[110px] h-7 flex items-center justify-center ">
                  <div className="flex items-center gap-2 ">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {totalCount} News
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Featured article */}
              <BigCardContentRight
                showParagraph={true}
                id={filteredNews[0].id}
                title={filteredNews[0].news_title}
                sub_title={filteredNews[0].news_sub_title}
                image={filteredNews[0].image || filteredNews[0].media_image}
                created_date_ad={filteredNews[0].created_date_ad}
                created_date_bs={filteredNews[0].created_date_bs}
              />

              {/* Other articles */}
              <div className="flex flex-wrap justify-evenly gap-[15px] sm:gap-[30px] my-4">
                {filteredNews.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="w-[95%] sm:w-[80%] xl:w-[40%] pb-4 pt-2 px-3 bg-green-100 rounded-md"
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
                      image={item.image || item.media_image}
                      id={item.id}
                      created_date_ad={item.created_date_ad}
                      created_date_bs={item.created_date_bs}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full py-3 mb-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 transition-colors duration-200 rounded-md font-medium"
                >
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    "Load More Articles"
                  )}
                </button>
              )}

              {/* End message */}
              {!hasMore && filteredNews.length > 10 && (
                <div className="text-center py-4 text-gray-500">
                  You've reached the end of articles in this category
                </div>
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
