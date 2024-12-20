"use client";
import { useState, useEffect } from "react";
import Hero from "../ChildComponents/Pages/Hero";
import Breadcrumb from "../ChildComponents/Others/Breadcrumb";
import Card1 from "../ChildComponents/Cards/Card1";
import Card2 from "../ChildComponent/Cards/Card2";
import Ads from "../ChildComponents/Advertisement/Ads";
import RoadBlocking from "../ChildComponents/Advertisement/Roadblocking";
import { useTheme } from "../Context/ThemeContext";
import { usePathname } from "next/navigation";
const Home = () => {
  const { bgColor } = useTheme();
  const [lge, setLge] = useState("np");
  const pathname = usePathname();
  // Set language on mount based on URL
  useEffect(() => {
    const language = pathname.includes("/en") ? "en" : "np";
    setLge(language);
  }, []);

  return (
    <div
      className="w-full flex justify-center absolute top-[120px]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-[400px] w-[97%] sm:w-[90%] mx-auto">
        {/* Roadblocking and Ads */}
        <RoadBlocking name="H_roadblocking_ads" />
        <Ads name="H_landscape_above_breaking" />

        {/* Hero Sections */}
        <Hero lge={lge} order={0} />
        <Ads name="H_landscape_between_breaking" />
        <Hero lge={lge} order={1} />
        <Ads name="H_landscape_after_breaking" />

        {/* News Section */}
        <div className="mt-20">
          <Breadcrumb
            addNews={true}
            myWord={lge === "en" ? "Highlights" : "समाचार"}
          />
          <Card1 myWord={lge === "en" ? "News" : "समाचार"} />
        </div>

        {/* Ads after News */}
        <div className="mt-10">
          <Ads name="H_landscape_after_samachar" />
        </div>

        {/* Agri-Tech Section */}
        <div className="mt-20">
          <Breadcrumb myWord={lge === "en" ? "Agri-Tech" : "कृषि प्रविधि"} />
          <Card2 myWord={lge === "en" ? "Agri-Tech" : "कृषि प्रविधि"} />
        </div>

        {/* Ads after Agri-Tech */}
        <div className="mt-10">
          <Ads name="H_landscape_krishi_prabidhi" />
        </div>

        {/* Content Layout */}
        <div className="mt-10">
          {/* Content Layout placeholder */}
          {/* <ContentLayout mukhyaShow={false} /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
