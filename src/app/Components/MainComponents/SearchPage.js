"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, Input, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import TrendingNews from "../../Components/ChildComponent/SideBarComponents/TrendingNews";
import SmallCardContentRight from "../../Components/ChildComponent/Boxes/SmallCardContentRight";
import { Get } from "../../Components/Redux/API";
import { useTheme } from "../../Components/Context/ThemeContext";
import { usePathname } from "next/navigation";

const SearchPage = () => {
  const { searchValue } = useParams();
  const router = useRouter();
  const { themeColor, bgColor } = useTheme();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(
    decodeURIComponent(searchValue) || ""
  );
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(14);
  const [language, setLanguage] = useState(
    pathname.includes("/en") ? "en" : "np"
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await Get({ url: `/search/search/?q=${searchValue}` });
        if (response) {
          const filteredBlogs = (response?.news || [])
            .filter((blog) => blog.active && blog.language === language)
            .sort((a, b) => b.id - a.id);

          setAllBlogs(filteredBlogs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchValue, language]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if in a form
      handleSearch();
    }
  };
  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(
        language === "en" ? `/en/search/${inputValue}` : `/search/${inputValue}`
      );
    }
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => Math.min(prev + 10, allBlogs.length)); // Prevent exceeding total length
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] md:w-[90%]">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : allBlogs.length === 0 ? (
          <div className="flex justify-center py-10">
            <h2 className="text-xl text-gray-500">No results found</h2>
          </div>
        ) : (
          <div className="w-full grid grid-cols-6">
            <div className="col-span-6 min-h-[80vh] w-full mr-5 md:h-full overflow-scroll lg:col-span-4 flex flex-wrap py-4 px-3 justify-start gap-4">
              <div className="flex mt-7 w-full gap-2 border-b-2 border-[#bd354e] items-center h-[80px]">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-2xl text-mukta text-[#254722] max-w-[90%] px-3 py-4 border-none"
                  style={{ fontWeight: "550" }}
                />
                <Button
                  type="primary"
                  onClick={handleSearch}
                  className="px-8 py-4"
                  style={{
                    backgroundColor: themeColor,
                    borderRadius: "100%",
                  }}
                  icon={<ArrowRightOutlined style={{ fontSize: "25px" }} />}
                />
                {/* </Input.Group> */}
              </div>
              <div className="flex flex-wrap gap-[15px] sm:gap-[30px] w-full">
                {allBlogs.slice(0, itemsToShow).map((blog) => (
                  <div
                    key={blog.id}
                    className="w-[95%] h-[150px] sm:w-[80%] lg:w-[70%] xl:w-[45%] pb-4 pt-2 px-3 rounded-md shadow-md"
                  >
                    <SmallCardContentRight
                      title={blog.news_title}
                      sub_title={blog.news_sub_title}
                      image={
                        `https://cms.krishisanjal.com${blog.image}` ||
                        blog.gallery_image
                      }
                      id={blog.id}
                      textBlack="true"
                      created_date_ad={blog.created_date_ad}
                      created_date_bs={blog.created_date_bs}
                    />
                  </div>
                ))}
              </div>
              {itemsToShow < allBlogs.length && (
                <Button
                  onClick={handleLoadMore}
                  type="primary"
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-100 text-white font-bold"
                >
                  Load More
                </Button>
              )}
            </div>

            <div className="col-span-6 lg:col-span-2 sm:pt-[30px]">
              <div className="sticky top-[60px]">
                <TrendingNews />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
