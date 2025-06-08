"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Get } from "../../Redux/API"; // Adjust this import path as needed
import { useNewsSearch } from "../../Context/searchNewsContext"; // Adjust this import path as needed
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const Gallery = ({ handleGalleryUpload, handleCancel }) => {
  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchValue } = useNewsSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const imagesPerPage = 10;

  const handleImageSelect = (imageUrl) => {
    handleGalleryUpload(imageUrl);
    handleCancel();
  };

  useEffect(() => {
    fetchImages();
  }, [searchValue]);

  useEffect(() => {
    updateDisplayedImages();
  }, [images, currentPage]);

  const handleNameSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchImages = async (url = "/news/news-images/") => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await Get({
        url,
        headers: headers,
      });
      const sortedImages = response
        .sort((a, b) => b.id - a.id)
        .filter((myImage) => myImage.image_url != null);
      setImages(sortedImages);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images. Please try again later.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedImages = () => {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    setDisplayedImages(images.slice(startIndex, endIndex));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(images.length / imagesPerPage))
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      await fetchImages();
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    const encodedQuery = encodeURIComponent(searchQuery.trim());

    try {
      const url = `/news/news/by-filename/${encodedQuery}/`;
      // console.log("Encoded query:", encodedQuery);
      // console.log("Url to push:", url);

      const response = await Get({ url, headers });
      console.log(response);
      const refinedData = response.map((item) => ({
        id: item.id,
        image_url: item.image_url,
        news_title: item.title,
      }));

      if (refinedData.length === 0) {
        setError("No images found for the given search query.");
        setImages([]);
      } else {
        setImages(refinedData);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching images:", err);
      setError("Failed to search images. Please try again.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0c4512] from-emerald-500 to-teal-500 text-white p-4 sm:p-8 space-y-8">
      <form onSubmit={handleSearch} className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleNameSearch}
          placeholder="Search by filename..."
          className="flex-grow p-2 rounded-l-md text-black"
        />
        <button
          type="submit"
          className="bg-white text-emerald-600 p-2 rounded-r-md hover:bg-emerald-100 transition duration-300"
          disabled={loading}
        >
          <Search size={20} />
        </button>
      </form>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-300 py-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayedImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => handleImageSelect(image.image_url)}
              >
                <Image
                  src={image.image_url}
                  alt={image.news_title || "Gallery Image"}
                  layout="fill"
                  className="transition-transform duration-300 hover:scale-110 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-opacity-0 hover:text-opacity-100 transition-opacity duration-300">
                    Select
                  </span>
                </div>
              </div>
            ))}
          </div>
          {images.length > 0 && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="bg-white text-emerald-600 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Previous</span>
              </button>
              <button
                onClick={goToNextPage}
                disabled={
                  currentPage === Math.ceil(images.length / imagesPerPage)
                }
                className="bg-white text-emerald-600 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;
