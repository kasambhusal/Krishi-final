"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../Context/ThemeContext";
import Breadcrumb from "../ChildComponent/Others/Breadcrumb";
import { usePathname } from "next/navigation";
import TajaSamachar from "../ChildComponent/SideBarComponents/TajaSamachar";
import { Get } from "../Redux/API";
import { Button, Spin, Card } from "antd";
import { useNavigation } from "../Context/NavigationContext";

export default function MyVideo() {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { bgColor } = useTheme();
  const pathname = usePathname();
  const { lge } = useNavigation();
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [page, setPage] = useState(1);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
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
      setVisibleVideos(filteredVideos.slice(0, 10));
    } catch (err) {
      console.error("Videos Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    const scrollToTop = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
    scrollToTop();
  }, []);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * 10;
    const endIndex = startIndex + 10;
    const newVideos = videos.slice(startIndex, endIndex);

    setTimeout(() => {
      setVisibleVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setPage(nextPage);
      setLoadingMore(false);
    }, 1000); // Simulating network delay
  }, [page, videos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className="py-4 w-full flex justify-center min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%]">
        <div className="w-full grid grid-cols-6  mt-10">
          <div className="col-span-6 md:col-span-4">
            <Breadcrumb
              showLinks={false}
              myWord={lge === "en" ? "Video" : "भिडियो"}
              addNews={false}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {visibleVideos.map((video) => (
                <Card
                  key={video.id}
                  hoverable
                  cover={
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={video.video_url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  }
                  bodyStyle={{ padding: 0 }}
                >
                  <Card.Meta
                    title={video.title}
                    description={video.description}
                    className="p-4"
                  />
                </Card>
              ))}
            </div>
            {visibleVideos.length < videos.length && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  type="primary"
                  size="large"
                  className="px-6 py-2 rounded-full"
                  icon={loadingMore && <Spin />}
                >
                  {loadingMore ? "Loading..." : "Show More"}
                </Button>
              </div>
            )}
          </div>
          <div className="col-span-6 md:col-span-2 mt-6 md:mt-0">
            <div className="sticky top-[60px] w-full">
              <TajaSamachar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
