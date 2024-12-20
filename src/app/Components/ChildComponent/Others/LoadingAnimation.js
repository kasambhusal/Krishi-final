import React from "react";
import Image from "next/image";
import "./LoadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-800 via-blue-800 to-purple-700">
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-8 ">
          <Image
            src="/logo.png"
            alt="Krishi Sanjal Logo"
            layout="fill"
            objectFit="contain"
            className="animate-pulse"
          />
          <div className="absolute inset-0 border-4 border-white rounded-full animate-spin-slow"></div>
          <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-reverse-spin"></div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 animate-bounce">
          Krishi Sanjal loading...
        </h2>
        <p className="text-white text-opacity-80 animate-pulse">
          Empowering Nepalese farmers with knowledge
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
