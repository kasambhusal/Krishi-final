"use client";
import React, { useState } from "react";
import Hero from "../app/Components/ChildComponent/Others/Hero";
import Breadcrumb from "../app/Components/ChildComponent/Others/Breadcrumb";
import Card1 from "../app/Components/ChildComponent/Cards/Card1";
import Ads from "../app/Components/ChildComponent/Advertisement/Ads";
import Card2 from "../app/Components/ChildComponent/Cards/Card2";
import ContentLayout from "../app/Components/MainComponents/ContentLayout";
import RoadBlocking from "../app/Components/ChildComponent/Advertisement/RoadBlocking"; // Import your RoadBlocking component
import { useTheme } from "../app/Components/Context/ThemeContext";
import { usePathname } from "next/navigation";
import { useNavigation } from "./Components/Context/NavigationContext";

const Main = () => {
  const { bgColor } = useTheme();
  const { lge } = useNavigation();

  return (
    <div
      className="w-full flex justify-center "
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-[400px] w-[97%] sm:w-[90%] mx-auto">
        <RoadBlocking name="H_roadblocking_ads" />
        <Ads name="H_landscape_above_breaking" />
        <Hero lge={lge} order={0} />
        <Ads name="H_landscape_between_breaking" />
        <Hero lge={lge} order={1} />
        <Ads name="H_landscape_after_breaking" />
        <div className="mt-20">
          <Breadcrumb
            addNews={true}
            myWord={lge === "en" ? "Highlights" : "समाचार"}
            go={lge === "en" ? "News" : ""}
          />
          <Card1 myWord={lge === "en" ? "News" : "समाचार"} />
        </div>
        <div className="mt-10">
          <Ads name="H_landscape_after_samachar" />
        </div>
        <div className="mt-20">
          <Breadcrumb myWord={lge === "en" ? "Agri-Tech" : "कृषि प्रविधि"} />
          <Card2 myWord={lge === "en" ? "Agri-Tech" : "कृषि प्रविधि"} />
        </div>
        <div className="mt-10">
          <Ads name="H_landscape_krishi_prabidhi" />
        </div>
        <div className="mt-10">
          <ContentLayout mukhyaShow={false} />
        </div>
      </div>
    </div>
  );
};

export default Main;
