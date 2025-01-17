import React from "react";
import SmallAds from "../Advertisement/SmallAds";
import Contact from "../Others/Contact";
import TajaSamachar from "../SideBarComponents/TajaSamachar";

const StorySideBar = React.memo(() => {
  return (
    <div className="col-span-11 xl:col-span-4 h-full px-5">
      <div>
        <SmallAds name="S_sidebar_before_followus1" />
        <SmallAds name="S_sidebar_before_followus2" />
        <h2 className="text-2xl font-bold">Follow Us:</h2>
        <Contact />
        <SmallAds name="S_sidebar_after_followus1" />
        <SmallAds name="S_sidebar_after_followus2" />
      </div>
      <div style={{ position: "sticky", top: "120px", zIndex: "5" }}>
        <TajaSamachar />
        <SmallAds name="S_sidebar_after_tajasamachar" />
      </div>
    </div>
  );
});

export default StorySideBar;
