"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Show button after scrolling down 300px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      // <>
      <button
        className="fixed bottom-5 right-5 bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform duration-300 z-50"
        onClick={scrollToTop}
        aria-label="Scroll to Top"
      >
        <FaArrowUp size={24} />
      </button>
      /* <button
          className="fixed bottom-5 right-5 bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-green-700 transition-transform duration-300 z-50"
          onClick={() => navigate("/dashboard/login")}
          aria-label="Login"
        >
          <LoginOutlined style={{ fontSize: 24 }} />
        </button> */
      // </>
    )
  );
}
