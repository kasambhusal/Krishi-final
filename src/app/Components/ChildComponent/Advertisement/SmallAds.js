"use client";
import React, { useEffect, useState } from "react";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";
import Image from "next/image"; // Import Image from Next.js

const SmallAds = ({ name }) => {
  const [loading, setLoading] = useState(false);
  const { lge } = useNavigation();
  const [filteredAd, setFilteredAd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Get({
          url: `/public/advertisement/get-advertisement?language=${lge}&ads_name=${name}`,
        });

        // Set to null if response is empty or invalid
        const adData =
          response && response[0] && response[0].ads_image ? response[0] : null;
        setFilteredAd(adData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilteredAd(null);
      } finally {
        setLoading(false);
      }
    };

    if (name && lge) {
      fetchData();
    }
  }, [lge, name]);

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

  return (
    <div className="max-w-full max-h-[500px] overflow-hidden flex justify-center my-5">
      {!loading && filteredAd && filteredAd.ads_image && (
        <div className="flex items-center justify-center my-5">
          <a href={filteredAd.ads_url} rel="noreferrer" target="_blank">
            {getMediaType(filteredAd.ads_image) === "image" && (
              <Image
                src={filteredAd.ads_image}
                alt="Ad"
                width={700} // Set width for optimization (can be adjusted as needed)
                height={450} // Set height for optimization (can be adjusted as needed)
                style={{ objectFit: "contain", maxHeight: "500px" }} // Ensures image maintains its aspect ratio
                loading="lazy" // Lazy load the image for better performance
              />
            )}
            {getMediaType(filteredAd.ads_image) === "video" && (
              <video
                src={filteredAd.ads_image}
                controls
                style={{ maxWidth: "100%", maxHeight: "450px" }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </a>
        </div>
      )}
    </div>
  );
};

export default SmallAds;
