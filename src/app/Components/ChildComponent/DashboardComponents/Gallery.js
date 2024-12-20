"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Get } from "../../Redux/API"; // Adjust this import path as needed
import { useNewsSearch } from "../../Context/searchNewsContext"; // Adjust this import path as needed
import { Download, Plus } from "lucide-react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchValue } = useNewsSearch();
  const [page, setPage] = useState(1);
  const [hasSearchContent, setHasSearchContent] = useState(false);
  const imagesPerPage = 20;

  useEffect(() => {
    fetchImages();
  }, [searchValue]);

  useEffect(() => {
    setDisplayedImages(images.slice(0, page * imagesPerPage));
  }, [images, page]);

  const fetchImages = async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      setHasSearchContent(hasContent);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/news/news";
      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });

      const imageData = hasContent ? response.news : response;
      const sortedImages = imageData
        .sort((a, b) => b.id - a.id)
        .filter((myImage) => myImage.image != null);
      setImages(sortedImages);
      setPage(1);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl, fileName) => {
    const fullImageUrl = hasSearchContent
      ? `https://cms.krishisanjal.com${imageUrl}`
      : imageUrl;

    fetch(fullImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const jpegBlob = new Blob([blob], { type: "image/jpeg" });
        const url = window.URL.createObjectURL(jpegBlob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(() => alert("Failed to download image"));
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 text-white p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedImages.map((image) => (
          <div
            key={image.id}
            className="bg-green-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="relative h-48 sm:h-64">
              <Image
                src={
                  hasSearchContent
                    ? `https://cms.krishisanjal.com${image.image}`
                    : image.image
                }
                alt={image.news_title || "Gallery Image"}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 truncate">
                {image.news_title}
              </h2>
              <p className="text-sm text-green-300 mb-4">
                {new Date(image.created_date_ad).toLocaleDateString()}
              </p>
              <button
                onClick={() =>
                  handleDownload(image.image, `image_${image.id}.jpg`)
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center justify-center"
              >
                <Download className="mr-2" size={18} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {displayedImages.length < images.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center text-lg"
          >
            <Plus className="mr-2" size={24} />
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
