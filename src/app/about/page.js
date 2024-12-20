"use client";
import React from "react";
import { useTheme } from "../Components/Context/ThemeContext";
import Image from "next/image";

export default function AboutUs() {
  const { bgColor } = useTheme();
  return (
    <div
      className=" w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-[60vh] mb-20 w-[97%] sm:w-[90%]">
        <div className="h-[60px] md:h-[70px] border-b m-auto !mt-8 flex items-center justify-center text-white text-lg md:text-2xl w-[95%] bg-[#185924]">
          <p className="border-b border-[#AFAEAE] px-2 uppercase">About Us</p>
        </div>
        <div className="w-[95%] xl:w-[80%] flex-col md:flex-row md:h-[400px] overflow-hidden m-auto gap-8 flex !mt-20 justify-center items-center">
          <Image
            src="/logo.png"
            alt="introduction"
            width={600} // Set a base width for optimization
            height={400} // Set a base height for optimization
            className="min-w-[300px] rounded-xl max-h-[70vh] shadow h-full min-h-[300px] md:w-[40%] w-[95%] bg-[#AFAEAE40] flex justify-end"
          />
          <div className="w-full h-full">
            <div id="dynamiccourses">
              <h3 className="text-xl font-semibold text-[#4A4A4A] tracking-wide mt-4 mb-1">
                Introduction
              </h3>
              <div className="text-justify tracking-wide inline"> </div>
            </div>
          </div>
        </div>
        <div className="w-[95%] xl:w-[80%] text-justify flex-col md:flex-row !mt-7 !mb-16 m-auto flex justify-between gap-10 items-center">
          <div className="min-h-[200px] md:h-[250px] max-h-[500px] overflow-hidden rounded-b-lg shadow-lg md:w-1/2 ">
            <div className="head bg-[#185924] h-[60px] text-white flex items-center justify-center relative w-full">
              <div className="text-2xl font-semibold tracking-wide border-b px-1">
                Mission
              </div>
              <div className="absolute right-8 scale-75">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="14" cy="14" r="14" fill="white" />
                  <path
                    d="M14 19.9982L6 12.4996L8.66792 10L14 14.9991L19.3321 10L22 12.4996L14 20V19.9982Z"
                    fill="#041962"
                  />
                </svg>
              </div>
            </div>
            <div className="md:p-5 p-4 md:px-10 tracking-wide lg:text-base text-slate-800">
              <div id="dynamiccourses">
                <div className="text-justify tracking-wide inline">
                  ............................Our mission....................
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-[200px] md:h-[250px] max-h-[500px] overflow-hidden rounded-b-lg shadow-lg md:w-1/2 ">
            <div className="head bg-[#185924] h-[60px] text-white flex items-center justify-center relative w-full">
              <div className="text-2xl font-semibold tracking-wide border-b px-1">
                Vision
              </div>
              <div className="absolute left-8 scale-75">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="14" cy="14" r="14" fill="white" />
                  <path
                    d="M14 19.9982L6 12.4996L8.66792 10L14 14.9991L19.3321 10L22 12.4996L14 20V19.9982Z"
                    fill="#041962"
                  />
                </svg>
              </div>
            </div>
            <div className="md:p-5 p-4 md:px-10 tracking-wide lg:text-base text-slate-800">
              <div id="dynamiccourses">
                <div className="text-justify tracking-wide inline">
                  .....................................Our
                  vision..................................
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
