"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

const Ads = ({ name }) => {
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

  // Show nothing if loading or no ad data
  if (loading || !filteredAd || !filteredAd.ads_image) {
    return null;
  }

  const mediaType = getMediaType(filteredAd.ads_image);

  return (
    <div className="w-full flex justify-center my-5">
      <div className="w-full flex items-center justify-center min-h-[120px]">
        <a
          href={filteredAd.ads_url}
          target="_blank"
          rel="noreferrer"
          className="max-w-full block"
        >
          {mediaType === "image" && (
            <Image
              src={filteredAd.ads_image || "/placeholder.svg"}
              alt="Advertisement"
              width={600}
              height={100}
              className="w-full h-auto max-w-full"
              style={{ objectFit: "contain" }}
              priority={false}
            />
          )}

          {mediaType === "video" && (
            <video
              src={filteredAd.ads_image}
              controls
              className="w-full h-auto max-w-full"
              style={{ objectFit: "contain" }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </a>
      </div>
    </div>
  );
};

export default Ads;
