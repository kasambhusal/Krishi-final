"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image
import { usePathname } from "next/navigation";

const SmallCardContentRight = ({
  showParagraph = false,
  textBlack = false,
  id,
  title,
  sub_title,
  image,
  created_date_ad,
  created_date_bs,
}) => {
  const pathname = usePathname();
  const [lge] = useState(pathname.includes("/en") ? "en" : "np");

  // const scrollToTop = () => {
  //   if (typeof window !== "undefined") {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const formattedAdDate =
    created_date_ad?.split("T")[0].split("-").join("/") || "";
  const formattedBsDate = created_date_bs?.replace(/-/g, "/") || "";

  return (
    <div className="w-full group cursor-pointer h-full overflow-hidden font-mukta">
      <Link
        href={
          lge === "en"
            ? `/en/story/${formattedAdDate}/${id}/${title}`
            : `/story/${formattedBsDate}/${id}`
        }
      >
        <div
          className="flex h-full gap-5"
          // onClick={scrollToTop}
        >
          <div
            className="w-[150px] overflow-hidden h-[100px] relative flex justify-center group bg-gray-200"
            style={{
              boxShadow: "0px 0px 16px black inset",
              borderRadius: "5px",
            }}
          >
            {/* Replace img with Image component */}
            <Image
              src={
                image || "https://cms.krishisanjal.com/media/author/logo_2.jpg"
              }
              alt={title} // Set alt text for accessibility
              width={150} // Set width for
              height={100} // Set height for optimization
              className="w-full h-[100px] max-w-full group-hover:opacity-80 group-hover:scale-105 transition-transform duration-200 rounded-sm"
              objectFit="cover" // Ensures the image covers the container
              loading="lazy" // Lazy load for better performance
            />
          </div>
          <div className="w-[60%] flex flex-col gap-1">
            <h2
              className={`${
                textBlack ? "text-black" : "text-white"
              } text-xl md:text-2xl line-clamp-3 !font-medium`}
              style={{
                overflowWrap: "break-word", // Ensure long words are wrapped only when necessary
                wordBreak: "normal", // Prevent breaking words like "book"
                whiteSpace: "normal", // Ensure proper line wrapping
                lineHeight: "1.5",
              }}
            >
              {title}
            </h2>
            {showParagraph && (
              <p
                className={`${
                  textBlack ? "text-black/80" : "text-white/80"
                } line-clamp-2 !font-normal`}
                style={{ lineHeight: "1.5" }}
              >
                {sub_title}
              </p>
            )}
            {/* Additional content can go here */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallCardContentRight;
