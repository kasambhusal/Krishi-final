"use client";
import React, { useState } from "react";
import { Select, Input, Form, Button, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
import { Post } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

const homeOptions = [
  { value: "H_roadblocking_ads", label: "Home Roadblocking" },
  { value: "H_landscape_top_header", label: "landscape_top_header" },
  { value: "H_landscape_above_breaking", label: "landscape_above_breaking" },
  {
    value: "H_landscape_between_breaking",
    label: "landscape_between_breaking",
  },
  { value: "H_landscape_after_breaking", label: "landscape_after_breaking" },
  { value: "H_landscape_after_samachar", label: "landscape_after_samachar" },
  { value: "H_landscape_krishi_prabidhi", label: "landscape_krishi_prabidhi" },
  {
    value: "H_landscape_after_bicharblog",
    label: "landscape_after_bicharblog",
  },
  {
    value: "H_landscape_after_pasupanchi",
    label: "landscape_after_pasupanchi",
  },
  {
    value: "H_landscape_after_krishakkokatha",
    label: "landscape_after_krishakkokatha",
  },
  { value: "H_landscape_after_video", label: "landscape_after_video" },
  { value: "H_sidebar_before_followus", label: "sidebar_before_followus" },
  { value: "H_sidebar_after_followus", label: "sidebar_after_followus" },
  { value: "H_sidebar_after_trending", label: "sidebar_after_trending" },
  { value: "H_sidebar_after_tajakhabar", label: "sidebar_after_tajakhabar" },
  { value: "H_sidebar_after_khanpin", label: "sidebar_after_khanpin" },
];

const singleOptions = [
  { value: "S_roadblocking_ads", label: "Single page Roadblocking" },
  { value: "S_landscape_before_title", label: "landscape_before_title" },
  { value: "S_landscape_after_title", label: "landscape_after_title" },
  { value: "S_landscape_after_content", label: "landscape_after_content" },
  { value: "S_sidebar_after_followus", label: "sidebar_after_followus" },
  { value: "S_sidebar_after_bicharblog", label: "sidebar_after_khanpin" },
  {
    value: "S_sidebar_after_tajasamachar",
    label: "sidebar_after_tajasamachar",
  },
];

export default function AdvertisementAdd({ handleCancel, setReload }) {
  const [section1, setSection1] = useState("");
  const { lge } = useNavigation();
  const [section2, setSection2] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!section1 || !section2 || !selectedFile) {
      message.error("Please fill in all fields and upload a file.");
      return;
    }

    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };

    const formData = new FormData();
    formData.append("language", lge);
    formData.append("ads_name", section2);
    formData.append("ads_url", value);
    formData.append("ads_image", selectedFile);

    setLoading(true);

    try {
      const response = await Post({
        url: "/advertisement/advertisement",
        data: formData,
        headers,
      });
      setLoading(false);
      setReload(true);
      message.success("Advertisement submitted successfully!");
      setSection1(""); // Reset section1
      setSection2(""); // Reset section2
      setValue(""); // Reset input value
      setSelectedFile(null); // Reset selected file
      setFilePreview(null); // Reset file preview
      document.getElementById("fileInput").value = "";
      handleCancel();

      // Clear the form after submission
      if (typeof window !== "undefined") {
        // Reload the page
        window.location.reload();
      }
      // Clear the file input manually
    } catch (error) {
      console.error("Error:", error);
      message.error("Error on advertisement post.");
      setLoading(false); // Ensure loading is reset on error
    } finally {
      setLoading(false);
    }
  };

  const fieldChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="p-5 border border-black rounded-md w-full">
      <div className="my-3 flex flex-col gap-5">
        <Select
          name="section1"
          style={{ width: "100%" }}
          onChange={setSection1}
          placeholder="--Which page--"
          options={[
            { value: "home", label: "Home page" },
            { value: "single", label: "Single page" },
          ]}
        />
        <Select
          name="section2"
          style={{ width: "100%" }}
          onChange={setSection2}
          placeholder="--Which part--"
          options={
            section1 === ""
              ? []
              : section1 === "home"
                ? homeOptions
                : singleOptions
          }
        />
      </div>
      <div className="flex flex-col my-3 gap-4">
        <Form.Item label="Link">
          <Input
            id="link"
            type="text"
            value={value}
            onChange={fieldChange}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Upload File">
          <input type="file" onChange={handleUpload} id="fileInput" />
          {filePreview && (
            <div style={{ marginTop: "10px" }}>
              {selectedFile && (
                <>
                  {selectedFile.type.startsWith("image/") &&
                    selectedFile.type !== "image/gif" && (
                      <Image
                        src={filePreview}
                        alt="Preview"
                        width={500} // Set a width for the image
                        height={300} // Set a height for the image
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                        loading="lazy"
                      />
                    )}
                  {selectedFile.type.startsWith("video/") && (
                    <video
                      src={filePreview}
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {selectedFile.type === "image/gif" && (
                    <Image
                      src={filePreview}
                      alt="GIF Preview"
                      width={500} // Set a width for the GIF
                      height={300} // Set a height for the GIF
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                      loading="lazy"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </Form.Item>
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        className="bg-blue-500"
      >
        Submit Advertisement
      </Button>
    </div>
  );
}
