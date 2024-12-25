import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Spin } from "antd";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

export default function Card8() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lge } = useNavigation();
  const scrollContainerRef = useRef(null); // Ref for the scroll container

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await Get({
          url: "/public/video-gallery/get-videoGallery",
        });

        let data;
        if (response && response.json) {
          data = await response.json();
        } else {
          data = response;
        }

        if (!data) {
          throw new Error("Failed to fetch videos");
        }
        const filteredVideos = data.sort((a, b) => b.id - a.id);
        setVideos(filteredVideos);
      } catch (err) {
        setError("Error loading videos. Please try again later.");
        console.error("Videos Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [lge]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center h-[50vh]">{error}</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="text-gray-500 text-center h-[50vh]">
        No videos available at the moment.
      </div>
    );
  }

  return (
    <div className="relative flex justify-center w-full overflow-hidden my-10">
      <div
        ref={scrollContainerRef} // Attach ref to the scroll container
        className="w-full lg:w-[95%] grid   grid-cols-3 gap-3 md:gap-1"
      >
        {videos.slice(0, 3).map((video, index) => {
          return (
            <div className=" col-span-3 lg:col-span-1">
              <iframe
                width="100%"
                height="220"
                src={video.video_url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ width: "100%" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
