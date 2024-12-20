"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image
import { usePathname } from "next/navigation";
export default function TrendingNewsBox({
  id,
  created_date_bs,
  created_date_ad,
  title,
  subtitle,
  image,
}) {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <Link
      href={
        lge === "en"
          ? `/en/story/${created_date_ad
              .split("T")[0]
              .split("-")
              .join("/")}/${id}/${title}`
          : `/story/${
              created_date_bs
                ? created_date_bs.replace(/-/g, "/")
                : "default_date"
            }/${id}` // Add a fallback or default date
      }
    >
      <div
        style={{
          padding: "10px 0px",
        }}
        className="grid grid-cols-5 h-[100px] cursor-pointer gap-[20px]"
        // onClick={scrollToTop}
      >
        <span className="col-span-3">
          <p
            className="text-xl  my-1 line-clamp-3 text-[rgba(0,0,0,0.7)] hover:text-green-700"
            style={{
              overflowWrap: "break-word", // Ensure long words are wrapped only when necessary
              wordBreak: "normal", // Prevent breaking words like "book"
              whiteSpace: "normal", // Ensure proper line wrapping
              lineHeight: "1.5",
              fontWeight: "600",
            }}
          >
            {title}
          </p>
        </span>
        {image ? (
          <Image
            src={image}
            alt={title || "Trending news image"} // Provide a meaningful alt text
            style={{ borderRadius: "5px" }}
            className="ml-[2px] w-full h-[80px]  col-span-2"
            width={200} // Set an appropriate width
            height={100} // Set an appropriate height
          />
        ) : (
          <div className="bg-gray-200 w-full h-full col-span-2"></div>
        )}
      </div>
    </Link>
  );
}
