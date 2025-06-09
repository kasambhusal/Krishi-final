"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NepaliDate } from "@zener/nepali-datepicker-react";
import { Skeleton } from "@mui/material";
import Image from "next/image"; // Import next/image
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const TopNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();
  const [filteredAd, setFilteredAd] = useState(null);

  // Function to convert English month name to Nepali
  const getNepaliMonthName = (monthName) => {
    const nepaliMonths = [
      "बैशाख",
      "जेठ",
      "असार",
      "श्रावण",
      "भाद्र",
      "आश्विन",
      "कार्तिक",
      "मंसिर",
      "पौष",
      "माघ",
      "फाल्गुन",
      "चैत्र",
    ];
    const englishMonths = [
      "Baisakh",
      "Jestha",
      "Ashar",
      "Shrawan",
      "Bhadra",
      "Aswin",
      "Kartik",
      "Mangsir",
      "Poush",
      "Magh",
      "Falgun",
      "Chaitra",
    ];

    const normalizedMonthName =
      monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

    const index = englishMonths.indexOf(normalizedMonthName);
    return index !== -1 ? nepaliMonths[index] : "Unknown Month";
  };

  // Function to convert English weekday to Nepali
  const getNepaliWeekday = (weekday) => {
    const nepaliWeekdays = [
      "आइतबार",
      "सोमबार",
      "मंगलबार",
      "बुधबार",
      "बिहिबार",
      "शुक्रबार",
      "शनिबार",
    ];
    const englishWeekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const index = englishWeekdays.indexOf(weekday);
    return index !== -1 ? nepaliWeekdays[index] : "Unknown Weekday";
  };

  // Function to convert English numerals to Nepali numerals
  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(number)
      .split("")
      .map((digit) => nepaliNumerals[parseInt(digit)] || digit)
      .join("");
  };

  // Get today's date in Nepali format
  const date = new NepaliDate();
  const weekday = date.format("dddd"); // Get the day of the week (in English)
  const day = date.format("DD"); // Get the day of the month
  const month = date.format("MMMM"); // Get the month (in English)
  const year = date.format("YYYY"); // Get the year

  const nepaliWeekday = getNepaliWeekday(weekday); // Convert to Nepali weekday
  const nepaliMonth = getNepaliMonthName(month); // Convert to Nepali month
  const nepaliDay = convertToNepaliNumerals(day); // Convert the day to Nepali numerals
  const nepaliYear = convertToNepaliNumerals(year); // Convert the year to Nepali numerals

  // Convert day and year to Nepali numerals
  const formattedNepaliDate = `${nepaliWeekday}, ${nepaliDay} ${nepaliMonth} ${nepaliYear}`;

  // Function to get English date in the same format
  const getEnglishDate = () => {
    const englishDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return englishDate.toLocaleDateString("en-US", options);
  };

  const formattedEnglishDate = getEnglishDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/advertisement/get-advertisement?language=${lge}&ads_name=H_landscape_top_header`,
        });
        // Set to null if response is empty or invalid
        const lastResponse = response[response.length - 1];
        const adData =
          response && lastResponse && lastResponse.ads_image
            ? lastResponse
            : null;
        setFilteredAd(adData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredAd(null);
      } finally {
        setLoading(false);
      }
    };

    if (lge) {
      fetchData();
    }
  }, [lge]);

  const getMediaType = (url) => {
    if (!url) return "unknown";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    }
    return "unknown";
  };

  const handleScroll = () => {
    if (window.scrollY > 600) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-[200px] sm:h-[120px] bg-transparent py-2 w-full">
      <div className="bg-red-30  w-full h-full grid grid-cols-10 justify-between items-center gap-[10px] sm:gap-[10px]">
        <div className="col-span-10 sm:col-span-2 flex flex-col item-center justify-center  order-2 sm:order-1">
          <Link
            href={lge === "en" ? "/en" : "/"}
            className=" flex justify-center sm:justify-start"
          >
            <Image
              src="/logo.png"
              alt="logo"
              className=" pl-[4px] sm:pl-0 object-contain cursor-pointer"
              height={75}
              width={200}
            />
          </Link>
          <span className="font-mukta text-[10px] pl-[3px] sm:text-sm  font-medium text-[#616161] text-center sm:text-start">
            {lge === "np" ? formattedNepaliDate : formattedEnglishDate}
          </span>
        </div>
        <div className="col-span-10 sm:col-span-8 h-full  flex justify-center sm:justify-end font-mukta items-end text-xl order-1 sm:order-2">
          {/* Media Section */}
          {!loading && filteredAd && (
            <div className="flex items-center justify-end">
              <a href={filteredAd.ads_url} target="_blank">
                {getMediaType(filteredAd.ads_image) === "image" && (
                  <Image
                    src={filteredAd.ads_image}
                    alt="Advertisement"
                    width={filteredAd.ads_image_width || 750} // You can adjust the width here
                    height={filteredAd.ads_image_height || 100} // You can adjust the height here
                    style={{ minWidth: "100%", maxHeight: "100px" }}
                  />
                )}
                {getMediaType(filteredAd.ads_image) === "video" && (
                  <video
                    src={filteredAd.ads_image}
                    controls
                    style={{ maxWidth: "100%", maxHeight: "70px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </a>
            </div>
          )}
        </div>
      </div>
      {isScrolled && (
        <div className=" px-2 bg-[#161616] text-white absolute top-[260px] sm:top-[180px] text-[11px] z-10 rounded-sm">
          {lge === "np" ? formattedNepaliDate : formattedEnglishDate}
        </div>
      )}
    </div>
  );
};

export default TopNav;
