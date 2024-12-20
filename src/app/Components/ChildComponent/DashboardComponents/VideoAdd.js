"use client";

import React, { useState } from "react";
import { useNavigation } from "../../Context/NavigationContext";
import { Post } from "../../Redux/API";
import { message } from "antd";

export default function VideoAdd({ handleCancel, setReload }) {
  const { lge } = useNavigation();
  const [formData, setFormData] = useState({
    title_name: "",
    video_url: "", // Changed from gallery_image to video_url
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Log the form data before sending
      console.log("Submitting form data:", formData);

      const response = await Post({
        url: "/gallery/video-gallery",
        data: { ...formData, language: lge },
        headers,
      });

      // Log the response
      console.log("Server response:", response);

      // Reset form fields
      setFormData({ title_name: "", video_url: "" });
      handleCancel();
      message.success("Video Added!");
      setReload(true);
    } catch (err) {
      console.error("Error adding video:", err);
      message.error("Error on Video addition");
      setError("Failed to add video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add New Video
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title_name"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title_name"
            name="title_name"
            value={formData.title_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label
            htmlFor="video_url"
            className="block text-sm font-medium text-gray-700"
          >
            YouTube Video URL
          </label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter YouTube video URL"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
          >
            {loading ? "Adding..." : "Add Video"}
          </button>
        </div>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}

