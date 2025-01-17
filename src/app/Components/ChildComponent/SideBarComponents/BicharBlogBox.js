"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BicharBlogBox({
  title,
  image,
  id,
  created_date_ad,
  created_date_bs,
}) {
  const [lge, setLge] = useState(
    window.location.pathname.includes("/en") ? "en" : "np"
  );

  return (
    <Link
      href={
        lge === "en"
          ? `/en/story/${created_date_ad
              .split("T")[0]
              .split("-")
              .join("/")}/${id}/${title}`
          : `/story/${created_date_bs.replace(/-/g, "/")}/${id}`
      }
      className="w-full"
    >
      <div
        style={{
          padding: "10px 0px",
        }}
        className="flex items-center h-[100px] w-full cursor-pointer"
      >
        <Image
          src={image}
          alt="image"
          style={{ borderRadius: "5px" }}
          className="mx-3 w-[100px] h-full"
          width={100}
          height={100}
        />
        <span className="flex-1">
          <p
            className="text-xl my-1 w-full text-[rgba(0,0,0,0.7)] hover:text-green-700 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3, // Limit text to 2 lines
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordWrap: "break-word", // Break long words if necessary
              wordBreak: "break-word",
              fontWeight: "600",
              lineHeight: "1.5",
              whiteSpace: "normal",
            }}
          >
            {title}
          </p>
        </span>
      </div>
    </Link>
  );
}
