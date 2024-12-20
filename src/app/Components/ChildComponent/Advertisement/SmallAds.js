import React from "react";
import { useAds } from "../../Context/AdsContext";
import Image from "next/image"; // Import Image from Next.js

const SmallAds = ({ name }) => {
  const { ads, loading } = useAds();

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    }
    return "unknown";
  };

  const filteredAd = ads.find((ad) => ad.ads_name === `${name}`);

  return (
    <div className="max-w-full max-h-[500px] flex justify-center my-5">
      {loading ? (
        <span>Loading...</span>
      ) : (
        filteredAd && (
          <div className="flex items-center justify-center my-5">
            <a href={filteredAd.ads_url} rel="noreferrer" target="_blank">
              {getMediaType(filteredAd.ads_image) === "image" && (
                <Image
                  src={filteredAd.ads_image}
                  alt="Ad"
                  width={700} // Set width for optimization (can be adjusted as needed)
                  height={450} // Set height for optimization (can be adjusted as needed)
                  style={{ objectFit: "contain" }} // Ensures image maintains its aspect ratio
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
        )
      )}
    </div>
  );
};

export default SmallAds;
