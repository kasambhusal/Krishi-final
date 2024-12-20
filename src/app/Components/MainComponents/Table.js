"use client";
import React from "react";

export default function Table() {
  return (
    <div className="flex justify-center w-full mt-10">
      <div className="w-[97%] sm:w-[90%] h-[100vh] overflow-scroll ">
        <iframe
          src="https://nepalicalendar.rat32.com/vegetable/embed.php"
          frameBorder="0"
          scrolling="no"
          style={{
            border: "none",
            overflow: "hidden",
            width: "100%",
            height: "3000px", // Ensure height is sufficient for content
            borderRadius: "5px",
            padding: "0",
            margin: "0",
          }}
          allowtransparency="true"
        ></iframe>
      </div>
    </div>
  );
}
