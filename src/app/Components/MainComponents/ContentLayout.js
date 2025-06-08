"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import SideContainer from "../ChildComponent/Others/SideContainer";
import Ads from "../ChildComponent/Advertisement/Ads";
import Card3 from "../ChildComponent/Cards/Card3";
import Card4 from "../ChildComponent/Cards/Card4";
import Card5 from "../ChildComponent/Cards/Card5";
import Card6 from "../ChildComponent/Cards/Card6";
import Card8 from "../ChildComponent/Cards/Card8";
import Card9 from "../ChildComponent/Cards/Card9";
import SmallAds from "../ChildComponent/Advertisement/SmallAds";
import { useNavigation } from "../Context/NavigationContext";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import TrendingNews from "../ChildComponent/SideBarComponents/TrendingNews";
import BicharBlog from "../ChildComponent/SideBarComponents/BicharBlog";

const ContentLayout = ({ mukhyaShow }) => {
  const { lge } = useNavigation();
  const [isMobile, setIsMobile] = useState(false);

  // Function to check and update screen size
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize); // Listen on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up
    };
  }, []);
  return (
    <div className="grid grid-cols-10 gap-10 my-5">
      <div className="lg:col-span-7 col-span-10 flg:mr-5">
        <div className="h-auto ">
          <Breadcrumb
            showLinks={true}
            myWord={
              lge === "en" ? "Livestock and Fishery" : "पशुपन्छी र मत्स्य"
            }
          />
          <div className="mt-5">
            <Card9
              myWord={
                lge === "en" ? "Livestock and Fishery" : "पशुपन्छी र मत्स्य"
              }
            />
          </div>
          <div className="my-[20px]">
            <Ads name="H_landscape_after_pasupanchi" />
          </div>
        </div>
        <div className="h-auto mt-[20px]">
          <Breadcrumb
            showLinks={false}
            myWord={lge === "en" ? "Opinion / Blog" : "विचार/ब्लग"}
          />
          <div className="my-5">
            <Card3 myWord={lge === "en" ? "Opinion / Blog" : "विचार ब्लग"} />
          </div>
          <Ads name="H_landscape_after_bicharblog" />
        </div>
        {isMobile && <TajaSamachar />}

        <div className="h-auto my-5">
          <div className="my-5">
            <Breadcrumb
              showLinks={false}
              myWord={lge === "en" ? "Farmer’s Story" : "कृषकको कथा"}
              go={lge === "en" ? "Story" : ""}
            />
            <Card5 myWord={lge === "en" ? "Story" : "कृषकको कथा"} />
          </div>
          <Ads name="H_landscape_after_krishakkokatha" />
        </div>
        {isMobile && <TrendingNews />}
        {lge === "np" && (
          <div className="h-auto mt-10">
            <Breadcrumb showLinks={false} myWord="फिचर" />
            <Card4 myWord="फिचर" />
          </div>
        )}

        <div className="h-auto my-2 sm:mb-[20px]">
          <Breadcrumb
            showLinks={false}
            myWord={lge === "en" ? "Research" : "अनुसन्धान विशेष"}
          />
          <Card6 myWord={lge === "en" ? "Research" : "अनुसन्धान विशेष"} />
        </div>
        {isMobile && <BicharBlog />}
        <div className="h-auto  mb-[20px]">
          <Breadcrumb
            showLinks={false}
            myWord={lge === "en" ? "Interview" : "अन्तर्वार्ता"}
          />
          <Card9 myWord={lge === "en" ? "Interview" : "अन्तर्वार्ता"} />
        </div>
        <div className="h-auto mt-[70px]">
          <div className="my-5">
            <Breadcrumb
              showLinks={false}
              addNews={false}
              myWord={lge === "en" ? "Videos" : "भिडियो"}
              video={true}
            />
            <Card8 />
          </div>
        </div>
        <div className="sticky top-[60px] z-15">
          <Ads name="H_landscape_after_video" />
        </div>
      </div>
      {!isMobile && (
        <div
          className="col-span-10 lg:col-span-3 border-lg "
          style={{ minHeight: "full" }}
        >
          <div>
            <SideContainer mukhyaShow={mukhyaShow} />
          </div>
          <div className="sticky top-[60px] z-15">
            <SmallAds name="H_sidebar_after_khanpin" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLayout;
// px-4 lg:shadow-inset-left-green
