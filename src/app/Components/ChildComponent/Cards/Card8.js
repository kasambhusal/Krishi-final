import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Spin } from "antd";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import { Get } from "../../Redux/API";

function getYouTubeEmbedUrl(url) {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
    return null;
  }
}

export default function Card8() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lge } = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
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

        const filteredVideos = data
          .filter((video) => video.language === lge)
          .sort((a, b) => b.id - a.id)
          .slice(0, 10); // Limit to 10 videos for the slider
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

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Scroll by a fixed amount (adjust as needed)
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [videos.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Scroll by a fixed amount (adjust as needed)
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [videos.length]);

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
    <div className="relative w-full overflow-hidden my-10">
      <div
        ref={scrollContainerRef} // Attach ref to the scroll container
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-scroll"
      >
        {videos.slice(currentIndex, currentIndex + 3).map((video, index) => {
          const embedUrl = getYouTubeEmbedUrl(video.video_url);

          if (!embedUrl) {
            return (
              <div key={video.id} className="text-red-500 text-center">
                Invalid YouTube URL
              </div>
            );
          }

          return (
            <div
              key={video.id}
              className={`aspect-video ${index === 1 ? "hidden sm:block" : ""} ${index === 2 ? "hidden lg:block" : ""}`}
            >
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={embedUrl}
                title={video.title_name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-0 w-full flex justify-between p-4 z-10 transform -translate-y-1/2">
        <Button
          aria-label="Previous"
          onClick={handlePrevious}
          className="bg-green-600 w-[40px] h-[40px] scale-90 text-white rounded-full hover:bg-[#2d5e29] duration-150 z-5"
        >
          <FaAngleLeft size={30} />
        </Button>

        <Button
          aria-label="Next"
          onClick={handleNext}
          className="bg-green-600 w-[40px] h-[40px] scale-90 text-white rounded-full hover:bg-[#2d5e29] duration-150 z-5"
        >
          <FaAngleRight size={30} />
        </Button>
      </div>
    </div>
  );
}
