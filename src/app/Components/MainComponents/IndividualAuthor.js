"use client";
import { useState, useEffect } from "react";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import TrendingNews from "../ChildComponent/SideBarComponents/TrendingNews";
import { useTheme } from "../Context/ThemeContext";
import SmallCardContentRight from "../ChildComponent/Boxes/SmallCardContentRight";
import { Get } from "../Redux/API";
import { useNavigation } from "../Context/NavigationContext";

export default function IndividualAuthor({
  authorId,
  author: initialAuthor,
  isValidAuthor,
  initialNews = [],
  hasMore: initialHasMore = false,
  totalNewsCount = 0,
}) {
  const { bgColor } = useTheme();
  const { lge } = useNavigation();

  // State for author data
  const [myAuthor, setMyAuthor] = useState(initialAuthor);

  // State for news data
  const [authorNews, setAuthorNews] = useState(initialNews);
  const [loadingNews, setLoadingNews] = useState(false);
  const [hasMoreNews, setHasMoreNews] = useState(initialHasMore);
  const [offset, setOffset] = useState(initialNews.length);
  const limit = 10;

  // Update state when language changes
  useEffect(() => {
    if (lge && isValidAuthor && initialNews.length === 0) {
      const fetchNews = async () => {
        try {
          setLoadingNews(true);
          const response = await Get({
            url: `/public/news/get-news?language=${lge}&author-id=${authorId}&limit=${limit}&offset=0`,
          });
          if (response && Array.isArray(response.results)) {
            setAuthorNews(response.results);
            setHasMoreNews(response.results.length === limit);
            setOffset(response.results.length);
          }
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoadingNews(false);
        }
      };
      fetchNews();
    }
  }, [lge, authorId, isValidAuthor, initialNews.length]);

  // Load more news function
  const handleLoadMore = async () => {
    if (!hasMoreNews || loadingNews) return;

    try {
      setLoadingNews(true);
      const response = await Get({
        url: `/public/news/get-news?language=${lge}&author-id=${authorId}&limit=${limit}&offset=${offset}`,
      });

      if (response && Array.isArray(response.results)) {
        if (response.results.length > 0) {
          setAuthorNews((prev) => [...prev, ...response.results]);
          setOffset((prev) => prev + response.results.length);
          setHasMoreNews(response.results.length === limit);
        } else {
          setHasMoreNews(false);
        }
      } else {
        setHasMoreNews(false);
      }
    } catch (error) {
      console.error("Error loading more news:", error);
      setHasMoreNews(false);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  if (!isValidAuthor) {
    return (
      <div
        className="w-full flex justify-center items-center min-h-[60vh]"
        style={{ backgroundColor: bgColor }}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Author Not Found
          </h1>
          <p className="text-gray-600">
            The author you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full flex justify-center mb-5"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%] flex flex-col items-center py-4 gap-[20px]">
        {/* Enhanced Author Header */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 shadow-sm border">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Author Image */}
            <div className="relative">
              <div
                style={{
                  backgroundImage: `url(${myAuthor?.image || "/placeholder.svg?height=200&width=200"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {myAuthor?.name}
              </h1>
              <p className="text-gray-600 mb-4">{myAuthor?.author_email}</p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {totalNewsCount} News
                    </span>
                  </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Author
                  </span>
                </div>
              </div>

              {/* Social Media */}
              {myAuthor?.social_media_url && (
                <div className="flex justify-center lg:justify-start">
                  <a
                    href={myAuthor.social_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    Follow
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-7 gap-6">
          <div className="col-span-7 lg:col-span-4">
            {/* Articles Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  News by {myAuthor?.name}
                </h2>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
              </div>

              {loadingNews && authorNews.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-medium text-gray-600">
                      Loading news...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {authorNews.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border py-2"
                      >
                        <SmallCardContentRight
                          showParagraph={false}
                          textBlack={true}
                          id={item.id}
                          title={item.news_title}
                          sub_title={item.news_sub_title}
                          image={item.image || item.media_image}
                          created_date_ad={item.created_date_ad}
                          created_date_bs={item.created_date_bs}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMoreNews && (
                    <button
                      className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200"
                      onClick={handleLoadMore}
                      disabled={loadingNews}
                    >
                      {loadingNews ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {lge === "en" ? "Loading..." : "लोड हुँदै..."}
                        </div>
                      ) : (
                        <span>
                          {lge === "en"
                            ? "Load More News"
                            : "थप समाचारहरू हर्नुहोस्"}
                        </span>
                      )}
                    </button>
                  )}

                  {/* End Messages */}
                  {!hasMoreNews && authorNews.length > 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p>
                        {lge === "en"
                          ? "You've reached the end of news by this author"
                          : "यस लेखकका सबै समाचारहरू समाप्त भयो"}
                      </p>
                    </div>
                  )}

                  {!loadingNews && authorNews.length === 0 && (
                    <div className="text-center py-12">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        {lge === "en"
                          ? "No news found for this author"
                          : "यस लेखकका लागि कुनै समाचार फेला परेन"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-span-7 lg:col-span-3 space-y-6">
            <div className="sticky top-[60px] space-y-6">
              <TajaSamachar />
              <TrendingNews />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
