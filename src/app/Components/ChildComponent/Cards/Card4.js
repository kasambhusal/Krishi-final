"use client";
import React, { useEffect, useState, useCallback } from "react";
import SmallCardContentBottom from "../Boxes/SmallCardContentBottom";
import { Button } from "antd";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNews } from "../../Context/NewsContext"; // Adjust the import based on your file structure

export default function Card4({ myWord }) {
  const { wholeNews, loading } = useNews(); // Get news and loading state from context
  const [currentIndex, setCurrentIndex] = useState(0);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const filteredResponse = wholeNews.filter(
      (item) => item.category_names.includes(myWord) || item.sub_category_names.includes(myWord)
      // &&        item.image != null
    );
    setNews(filteredResponse);
  }, [wholeNews, myWord]);

  const getCardsPerSlide = () => {
    // Adjust cards per slide based on screen size
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) return 2; // 2 cards for large screens
      return 1; // 1 card for small screens
    }
  };

  const cardsPerSlide = getCardsPerSlide();
  const totalCards = Math.min(news.length, 10); // Set max length to 10

  // Memoize handleNext using useCallback
  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - cardsPerSlide) {
      setCurrentIndex(currentIndex + cardsPerSlide);
    } else {
      setCurrentIndex(0); // Loop back to the start
    }
  }, [currentIndex, totalCards, cardsPerSlide]); // Add dependencies

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - cardsPerSlide);
    } else {
      setCurrentIndex(totalCards - cardsPerSlide); // Loop to the last slide
    }
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext(); // Now handleNext is stable and correctly listed in the dependencies
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [handleNext, currentIndex, totalCards]); // Add handleNext to the dependencies

  return (
    <>
      {loading ? (
        <div className="h-[60vh] flex justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : news.length > 0 ? (
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              width: `${(totalCards / cardsPerSlide) * 100}%`,
              transform: `translateX(-${(currentIndex / totalCards) * 100}%)`,
            }}
          >
            {news.slice(0, totalCards).map((item) => (
              <div key={item.id} className="w-[50%] h-full p-[20px]">
                <SmallCardContentBottom
                  id={item.id}
                  title={item.news_title}
                  sub_title={item.news_sub_title}
                  image={item.media_image || item.image}
                  lineClampTitle={2}
                  lineClampDes={2}
                  textBlack={true}
                  showParagraph={false}
                  created_date_ad={item.created_date_ad}
                  created_date_bs={item.created_date_bs}
                />
              </div>
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="absolute bottom-[50%] left-0 w-full flex justify-between p-4 z-10">
            <Button
              aria-label="Previous"
              onClick={handlePrevious}
              className="bg-green-600 w-[40px] h-[40px] scale-90 text-white rounded-full hover:bg-[#2d5e29] duration-150"
            >
              <FaAngleLeft size={30} />
            </Button>

            <Button
              aria-label="Next"
              onClick={handleNext}
              className="bg-green-600 w-[40px] h-[40px] scale-90 text-white rounded-full hover:bg-[#2d5e29] duration-150"
            >
              <FaAngleRight size={30} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 h-[60vh]"> </div>
      )}
    </>
  );
}
