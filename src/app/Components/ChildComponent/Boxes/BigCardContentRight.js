"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
const BigCardContentRight = ({
  showParagraph = false,
  id,
  title,
  sub_title,
  image,
  created_date_ad,
  created_date_bs,
}) => {
  const pathname = usePathname();
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");

  return (
    <div
      className=" h-[370px] sm:h-[350px]"
      style={{ background: " linear-gradient(to top, #006400, #E8F5E9)" }}
    >
      <Link
        href={
          lge === "en"
            ? `/en/story/${created_date_ad.split("T")[0].split("-").join("/")}/${id}/${title}`
            : `/story/${created_date_bs.replace(/-/g, "/")}/${id}`
        }
      >
        <div className="w-full group cursor-pointer h-full overflow-hidden font-mukta">
          <div
            className="flex flex-col sm:flex-row h-full "
            style={{ borderRadius: "5px" }}
          >
            <div
              className="w-full sm:w-3/5 overflow-hidden h-[250px] sm:h-full relative  group"
              style={{
                boxShadow: "0px 0px 10px #a8a4a3 inset",
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-full group-hover:opacity-80 group-hover:scale-110 duration-150 "
                  width={300}
                  height={100}
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt={title}
                  className="w-full h-full group-hover:opacity-80 group-hover:scale-110 duration-150 "
                  width={300}
                  height={100}
                />
              )}
            </div>
            <div className="w-full sm:w-2/5 flex flex-col h-[150px] sm:h-full justify-center gap-10 ">
              <h2
                className="text-[#006400] font-bold font-bold text-2xl text-center  sm:text-3xl line-clamp-3 !font-medium leading-6 px-2"
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
                  className="text-[#f5f5dc] text-base text-xl line-clamp-4 !font-normal "
                  style={{ lineHeight: "1.5" }}
                >
                  {sub_title}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigCardContentRight;
