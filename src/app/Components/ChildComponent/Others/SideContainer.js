import React from "react";
import Contact from "./Contact";
import BicharBlog from "../../ChildComponent/SideBarComponents/BicharBlog";
import TajaSamachar from "../../ChildComponent/SideBarComponents/TajaSamachar";
import TrendingNews from "../../ChildComponent/SideBarComponents/TrendingNews";
import SmallAds from "../Advertisement/SmallAds";

const SideContainer = ({ mukhyaShow }) => {
  return (
    <div className="w-full h-auto">
      <SmallAds name="H_sidebar_before_followus" />
      <div className="mt-10 w-full h-auto">
        {!mukhyaShow && (
          <div className="w-full">
            <h2 className="text-xl font-bold">Follow Us:</h2>
            <Contact />
          </div>
        )}
        <SmallAds name="H_sidebar_after_followus" />
        <TajaSamachar />
        <SmallAds name="H_sidebar_after_trending" />
        {/* {mukhyaShow && <MukhyaSamachar />} */}
        {!mukhyaShow && (
          <div className="flex flex-col gap-[10px] w-full">
            <TrendingNews />
            <SmallAds name="H_sidebar_after_tajakhabar" />
            <BicharBlog />
          </div>
        )}
      </div>
    </div>
  );
};

export default SideContainer;
