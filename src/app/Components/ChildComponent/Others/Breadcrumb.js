"use client";

import React, { useMemo } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PropTypes from "prop-types";

// Assuming you have a ThemeContext
import { useTheme } from "../../Context/ThemeContext";

const Breadcrumb = ({ myWord, addNews = true, video = false, go = "" }) => {
  const pathname = usePathname();
  const { themeColor } = useTheme();
  const cleanedPath = encodeURIComponent(go || myWord);

  const lge = useMemo(
    () => (pathname.includes("/en") ? "en" : "np"),
    [pathname]
  );

  // const scrollContainerRef = useRef <HTMLDivElement> null;
  // const [canScrollLeft, setCanScrollLeft] = useState(false);
  // const [canScrollRight, setCanScrollRight] = useState(false);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const checkScrollable = () => {
  //     if (scrollContainerRef.current) {
  //       const { scrollWidth, clientWidth, scrollLeft } =
  //         scrollContainerRef.current;
  //       setCanScrollLeft(scrollLeft > 0);
  //       setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  //     }
  //   };

  //   const debouncedCheckScrollable = () => {
  //     clearTimeout(window.debounceTimer);
  //     window.debounceTimer = setTimeout(checkScrollable, 200);
  //   };

  //   checkScrollable();
  //   window.addEventListener("resize", debouncedCheckScrollable);
  //   const scrollContainer = scrollContainerRef.current;
  //   scrollContainer?.addEventListener("scroll", checkScrollable);

  //   return () => {
  //     window.removeEventListener("resize", debouncedCheckScrollable);
  //     scrollContainer?.removeEventListener("scroll", checkScrollable);
  //   };
  // }, []);

  // const scrollRight = () => {
  //   scrollContainerRef.current?.scrollBy({ left: 100, behavior: "smooth" });
  // };

  // const scrollLeft = () => {
  //   scrollContainerRef.current?.scrollBy({ left: -100, behavior: "smooth" });
  // };

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <div className="my-5">
      <div className="w-full h-full flex items-center gap-3 font-mukta font-semibold">
        <p
          style={{ color: themeColor }}
          className="text-nowrap text-2xl sm:text-4xl"
        >
          {myWord}
        </p>
        <div className="w-full bg-[#509933] h-[0.05rem]"></div>
        {addNews && (
          <Link href={lge === "en" ? `/en/${cleanedPath}` : `/${cleanedPath}`}>
            <div
              className="flex items-center text-nowrap text-l text-[#2a511b] cursor-pointer hover:tracking-wide duration-200 hover:text-[#509933] group"
              // onClick={scrollToTop}
            >
              <p>{lge === "en" ? "All" : "थप समाचार"}</p>

              <GoArrowUpRight className="group-hover:ml-0.5 duration-200" />
            </div>
          </Link>
        )}
        {video && (
          <Link href={lge === "en" ? `/en/video` : `/video`}>
            <div
              className="flex items-center text-nowrap text-l text-[#2a511b] cursor-pointer hover:tracking-wide duration-200 hover:text-[#509933] group"
              // onClick={scrollToTop}
            >
              <p>{lge === "en" ? "All" : "सबै"}</p>

              <GoArrowUpRight className="group-hover:ml-0.5 duration-200" />
            </div>
          </Link>
        )}
      </div>

      {/* {showLink && (
        <div className="mt-2 rounded relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-hidden"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
          >
            <ul className="flex justify-start gap-3 items-center mt-2">
              {Array.from({ length: 20 }).map((_, index) => (
                <li
                  key={index}
                  className="py-1 px-3 select-none cursor-pointer hover:bg-[#509933] hover:text-white duration-200 font-mukta text-sm font-medium pt-1.5 rounded border border-[#509933]"
                >
                  <p>पर्यावरण</p>
                </li>
              ))}
            </ul>
          </div>
          {/* {canScrollLeft && (
            <div
              className="absolute left-0 top-0 h-full flex items-center justify-center bg-gradient-to-r from-[#def9de] cursor-pointer group hover:to-[#f5ebeb5e] to-[#ffffff34]"
              onClick={scrollLeft}
            >
              <FaChevronLeft className="text-[#509933] group-hover:text-[#000000] text-lg" />
            </div>
          )}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 h-full flex items-center justify-center bg-gradient-to-l from-[#def9de] cursor-pointer group hover:to-[#f5ebeb5e] to-[#ffffff34]"
              onClick={scrollRight}
            >
              <FaChevronRight className="text-[#509933] group-hover:text-[#000000] text-lg" />
            </div>
          )} */}
      {/* </div>
      )} */}
    </div>
  );
};

Breadcrumb.propTypes = {
  myWord: PropTypes.string.isRequired,
  addNews: PropTypes.bool,
  showLink: PropTypes.bool,
};

export default Breadcrumb;
