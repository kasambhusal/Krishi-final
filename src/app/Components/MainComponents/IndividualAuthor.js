"use client";
import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import TajaSamachar from "../../Components/ChildComponent/SideBarComponents/TajaSamachar";
import TrendingNews from "../../Components/ChildComponent/SideBarComponents/TrendingNews";
import { useNews } from "../../Components/Context/NewsContext";
import { useAuthors } from "../../Components/Context/AuthorContext";
import { useTheme } from "../../Components/Context/ThemeContext";
import SmallCardContentRight from "../ChildComponent/Boxes/SmallCardContentRight";

export default function IndividualAuthor() {
  const params = useParams();
  const pathname = usePathname();
  const { authorId } = params;
  const { bgColor } = useTheme();
  const [itemsToShow, setItemsToShow] = useState(10); // Number of items to show
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  const { wholeNews, loadingNews } = useNews(); // Fetch news and loading state from context
  const { authors, loading: loadingAuthors } = useAuthors(); // Fetch authors and loading state from context

  const myAuthor = authors.find((author) => author.id === Number(authorId)); // Find author by ID

  const filteredNews = wholeNews.filter(
    (item) =>
      item.author_name === authorId &&
      item.active === true &&
      item.language === lge
  );

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 10); // Load 10 more items
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  }, []);
  return (
    <div
      className="w-full flex justify-center mb-5 sm:flex-wrap"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%] flex flex-col items-center py-4 gap-[20px]">
        {/* Author Loading Indicator */}
        {loadingAuthors ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-xl font-bold"></p>
          </div>
        ) : myAuthor ? (
          <div
            className="flex flex-col sm:flex-row w-full gap-0"
            style={{ borderBottom: "1px solid #898b8f" }}
          >
            <div
              style={{
                backgroundImage: `url(${myAuthor.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "100%",
              }}
              className="xl:mx-5 sm:my-5 w-[200px] sm:w-[150px] h-[320px] sm:h-[150px]"
            ></div>
            <div className="flex flex-col mt-[-20px] sm:mt-0 h-full justify-center gap-[5px]">
              <h2 className="font-mukta text-2xl font-bold">{myAuthor.name}</h2>
              <h2 className="font-mukta text-xl">{myAuthor.author_email}</h2>
              <h2 className="font-mukta text-l w-full">
                <a
                  href={myAuthor.social_media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ion-icon name="logo-facebook" size="large"></ion-icon>
                </a>
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-20">
            <p className="text-xl font-bold">Author Not Found</p>
          </div>
        )}

        <div className="w-full grid grid-cols-7">
          <div className="col-span-7 lg:col-span-4">
            {/* News Loading Indicator */}
            {loadingNews ? (
              <div className="flex justify-center items-center h-20">
                <p className="text-xl font-bold">Loading News...</p>
              </div>
            ) : (
              <>
                {filteredNews.slice(0, itemsToShow).map((item) => (
                  // <div
                  //   key={item.id}
                  //   className="flex gap-[10px] my-3 w-full"
                  //   style={{
                  //     borderRadius: "10px",
                  //     padding: "10px 15px",
                  //     boxShadow: "0 0 8px #c6f7ba ",
                  //   }}
                  // >
                  //   {/* Replace img with Image component from next/image */}
                  //   <Image
                  //     src={
                  //       item.image ||
                  //       "https://cms.krishisanjal.com/media/author/logo_2.jpg"
                  //     }
                  //     alt="News Image"
                  //     className="authorImg rounded-lg"
                  //     width={250} // Set width for optimization
                  //     height={150} // Set height for optimization
                  //     style={{
                  //       borderRadius: "10px",
                  //       height: "150px",
                  //       width: "250px",
                  //     }}
                  //   />

                  //   <span className="flex flex-col gap-[8px] ">
                  //     <Link
                  //       href={
                  //         lge === "en"
                  //           ? `/en/story/${item.created_date_ad.split("T")[0].replace(/-/g, "/")}/${item.id}/${encodeURIComponent(item.news_title)}`
                  //           : `/story/${item.created_date_bs.replace(
                  //               /-/g,
                  //               "/"
                  //             )}/${item.id}`
                  //       }
                  //     >
                  //       <h2 className="font-mukta text-2xl font-bold line-clamp-2 sm:w-[90%] hover:text-green-700 cursor-pointer">
                  //         {item.news_title}
                  //       </h2>
                  //     </Link>
                  //   </span>
                  // </div>
                  <div className="h-[120px] w-full">
                    <SmallCardContentRight
                      showParagraph={false}
                      textBlack={true}s
                      id={item.id}
                      title={item.news_title}
                      sub_title={item.news_sub_title}
                      image={item.image || item.media_image}
                      created_date_ad={item.created_date_ad}
                      created_date_bs={item.created_date_bs}
                    />
                  </div>
                ))}

                <div className="w-full flex justify-end">
                  {itemsToShow < filteredNews.length && (
                    <button
                      className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-full font-bold"
                      onClick={handleLoadMore}
                    >
                      {lge === "en" ? "Load more" : "थप हर्नुहोस"}
                    </button>
                  )}
                </div>
                <hr className="h-2px" />
              </>
            )}
          </div>

          <div
            className="col-span-7 lg:col-span-3 xl:px-10 flex flex-col gap-[20px]"
            style={{ minHeight: "80vh" }}
          >
            <TajaSamachar />
            <div className="sticky top-[60px]">
              <TrendingNews />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
