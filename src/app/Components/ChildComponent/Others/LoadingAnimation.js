"use client";
import Image from "next/image";
import { User, Sprout } from "lucide-react";

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-8 h-8 text-green-600">
          <Sprout className="w-full h-full" />
        </div>
        <div className="absolute top-20 right-20 w-6 h-6 text-green-500">
          <Sprout className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-20 w-10 h-10 text-green-400">
          <Sprout className="w-full h-full" />
        </div>
        <div className="absolute bottom-10 right-10 w-7 h-7 text-green-600">
          <Sprout className="w-full h-full" />
        </div>
      </div>

      <div className="text-center z-10">
        {/* Main Content Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-green-100">
          {/* Logo Section */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"></div>
            <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Image
                src="/logo.png"
                alt="Krishi Sanjal Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>

          {/* Farmer Icon with Animation */}
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <User className="w-8 h-8 text-white" />
            </div>
            {/* Thinking dots */}
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Krishi Sanjal
              </span>
            </h2>

            <div className=" h-6">
              <p className="text-gray-600 animate-bounce text-sm font-medium">
                Empowering Nepalese farmers with knowledge
              </p>
            </div>
          </div>

          {/* Loading Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 animate-pulse">
              Loading your agricultural insights...
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
