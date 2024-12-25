"use client";
import React, { useEffect, useState } from "react";
import Ads from "../ChildComponent/Advertisement/Ads";
import Share from "../ChildComponent/Others/Share";
import Contact from "../ChildComponent/Others/Contact";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import AuthorBredCrumb from "../ChildComponent/Others/AuthorBredCrumb";
import SmallAds from "../ChildComponent/Advertisement/SmallAds";
import { useTheme } from "../Context/ThemeContext";
import RoadBlocking from "../ChildComponent/Advertisement/RoadBlocking";
import FormatNepaliDate from "../JS/FormatNepaliDate";
import FormatEnglishDate from "../JS/FormatEnglishDate";
import { useCount } from "../Context/CountContext";
import { Get } from "../Redux/API";
import Image from "next/image";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import Card10 from "../ChildComponent/Cards/Card10";
import { usePathname } from "next/navigation";

const Story = ({ news }) => {
  const { themeColor, bgColor } = useTheme();
  const { count } = useCount();
  const [scrolled, setScrolled] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const [viewsId, setViewsId] = useState(null);
  const [shareCount, setShareCount] = useState(0);
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  useEffect(() => {
    setNepaliDate(FormatNepaliDate(news.self_date));
    setEnglishDate(FormatEnglishDate(news.self_date));
  }, [news]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    const fetchAndPostViews = async () => {
      try {
        const response = await count;
        const filteredResponse = response.find(
          (item) => item.title === String(news.id)
        );
        if (filteredResponse) {
          const response2 = await Get({
            url: `/count/posts/${filteredResponse.id}/`,
          });
          if (response2) {
            setShareCount(JSON.parse(response2.shares[0].share_count));
            setViewsId(response2.id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndPostViews();
  }, [count, news.id]);

  const renderHtmlContent = (htmlString) => {
    const parseOembed = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Find all <oembed> tags
      const oembedElements = doc.querySelectorAll("oembed");
      oembedElements.forEach((oembed) => {
        const url = oembed.getAttribute("url");

        if (url) {
          let embedUrl = url;

          // Handle YouTube URLs
          if (url.includes("youtube.com/watch")) {
            const videoId = new URL(url).searchParams.get("v");
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          }

          // Replace <oembed> with an <iframe>
          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", embedUrl);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "true");
          iframe.style.width = "100%";
          iframe.style.height = "400px";
          oembed.replaceWith(iframe);
        }
      });

      return doc.body.innerHTML;
    };

    // Parse and replace <oembed> tags in the HTML string
    const processedHtml = parseOembed(htmlString);

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: processedHtml || "<p>No content to display.</p>",
        }}
        className="content"
        style={{ lineHeight: "1.6", wordWrap: "break-word" }}
      />
    );
  };

  return (
    <div
      className="flex justify-center w-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col justify-center w-[97%] sm:w-[90%]">
        <RoadBlocking name="S_roadblocking_ads" />
        <Ads name="S_landscape_before_title" />

        <span
          className={`w-full text-${
            scrolled
              ? "xl pl-3 mt-[30px] md:text-3xl shadow-lg"
              : "3xl md:text-5xl"
          } 
          duration-[1s] font-bold sticky top-[59px] z-10 p-2`}
          style={{
            lineHeight: "1.5",
            transition: "font-size 0.2s ease-in-out",
            backgroundColor: bgColor,
          }}
        >
          <h1
            className="w-full break-words mt-[20px]"
            style={{
              overflowWrap: "break-word", // Ensure long words are wrapped only when necessary
              wordBreak: "normal", // Prevent breaking words like "book"
              whiteSpace: "normal", // Ensure proper line wrapping
            }}
          >
            {news.news_title}
          </h1>
        </span>
        {news.news_sub_title && (
          <span
            className="text-2xl pl-3  my-3 w-full"
            style={{
              lineHeight: "1.5",
              transition: "font-size 0.2s ease-in-out",
              backgroundColor: bgColor,
            }}
          >
            <h1 className="text-[#4f4f4f] w-[98%]">{news.news_sub_title}</h1>
          </span>
        )}

        <div className="flex flex-col w-full items-center gap-12 py-4 mt-8 mb-5">
          <div className="w-full flex flex-wrap justify-between sm:px-5">
            <h2 className="flex gap-5 items-center text-center ">
              <AuthorBredCrumb
                id={news.author_name}
                englishDate={englishDate}
                nepaliDate={nepaliDate}
                category={news.category_name}
                language={news.language}
              />
            </h2>
            <span className="flex gap-[15px] justify-end w-full lg:w-auto ">
              <Share
                newsTitle={news.news_title}
                id={viewsId}
                shareCount={shareCount}
              />
            </span>
          </div>
        </div>

        <Ads name="S_landscape_after_title" />
        <div className="w-full grid grid-cols-11">
          <div className="col-span-11 xl:col-span-7 w-full h-full">
            <div className="flex flex-col gap-[20px] w-full">
              {news.image ||
                (news.media_image && (
                  <Image
                    src={news.image || news.media_image}
                    alt={news.news_title}
                    style={{
                      border: `2px dotted ${themeColor}`,
                      borderRadius: "5px",
                    }}
                    className="w-full"
                    width={1200}
                    height={600}
                  />
                ))}
              <div style={{ backgroundColor: bgColor, width: "100%" }}>
                {renderHtmlContent(news.news_post)}
              </div>
              {news.table_html && renderHtmlContent(news.table_html)}
            </div>
            <div className="my-5">
              <Share
                newsTitle={news.news_title}
                id={news.id}
                shareCount={shareCount}
              />
            </div>
            <Ads name="S_landscape_after_content" />
            <div className="mt-6">
              <Breadcrumb
                showLinks={false}
                addNews={false}
                myWord={lge === "en" ? "Related News" : "सम्बन्धित खबर"}
              />
              <Card10 myWord={news.category_name} id={news.id} />
            </div>
          </div>
          <div className="col-span-11 xl:col-span-4 h-full px-5">
            <div>
              <SmallAds name="S_sidebar_before_followus1" />
              <SmallAds name="S_sidebar_before_followus2" />
              <h2 className="text-2xl font-bold">Follow Us:</h2>
              <Contact />
              <SmallAds name="S_sidebar_after_followus1" />
              <SmallAds name="S_sidebar_after_followus2" />
            </div>
            <div style={{ position: "sticky", top: "120px", zIndex: "5" }}>
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
