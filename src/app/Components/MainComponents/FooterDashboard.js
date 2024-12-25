import React from "react";

export default function FooterDashboard() {
  return (
    <footer
      style={{ minHeight: "5vh", marginTop: "70px" }}
      className="flex items-center gap-[5px] w-full justify-center"
    >
      <div
        style={{
          height: "70px",
          width: "100%",
          // backgroundColor: "#2d5e29",
          marginTop: "50px",
          // backgroundColor: themeColor,
        }}
        className={`flex flex-wrap  justify-center items-center gap-2 px-2 sm:px-0 `}
      >
        <h2 className=" text-l " style={{ color: "#878684" }}>
          Copyright © 2024 Krishi Sanjal
        </h2>
        <h2 className=" text-l " style={{ color: "#878684" }}>
          |
        </h2>
        <a
          href="https://tachyonwave.com/"
          target="_blank"
          style={{ textDecoration: "none" }}
          className=" text-[#878684] text-l"
        >
          Developed by Tachyonwave
        </a>
      </div>
    </footer>
  );
}
