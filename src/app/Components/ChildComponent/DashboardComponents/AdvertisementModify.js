"use client";
import React, { useState, useEffect } from "react";
import { Select, Input, Form, Button, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
import { Put } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

const homeOptions = [
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
    value: "H_landscape_after_pasupanchi",
    label: "landscape_after_pasupanchi",
  },
  {
    value: "H_landscape_after_bicharblog",
    label: "landscape_after_bicharblog",
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
  { value: "H_sidebar_after_bicharblog", label: "sidebar_after_bicharblog" },
];

const singleOptions = [
  { value: "S_landscape_top_header", label: "landscape_top_header" },
  { value: "S_landscape_before_title", label: "landscape_before_title" },
  { value: "S_landscape_after_title", label: "landscape_after_title" },
  { value: "S_landscape_after_content", label: "landscape_after_content" },
  { value: "S_sidebar_after_followus", label: "sidebar_after_followus" },
  { value: "S_sidebar_after_bicharblog", label: "sidebar_after_bicharblog" },
];

export default function AdvertisementModify({
  handleCancel,
  selectedAd,
  setReload,
}) {
  const [section1, setSection1] = useState("");
  const { lge } = useNavigation();
  const [section2, setSection2] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (selectedAd) {
      // Populate the fields with the selected advertisement data
      setSection2(selectedAd.ads_name); // Set section2 based on selectedAd
      setValue(selectedAd.ads_url); // Assuming ads_url is the link

      // Determine section1 based on the first letter of section2
      if (selectedAd.ads_name && selectedAd.ads_name.charAt(0) === "H") {
        setSection1("home");
      } else if (selectedAd.ads_name && selectedAd.ads_name.charAt(0) === "S") {
        setSection1("single");
      }
    }
  }, [selectedAd]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };

    const formData = new FormData();
    formData.append("language", lge);
    formData.append("ads_name", section2);
    formData.append("ads_url", value);
    formData.append("ads_image", selectedFile);

    try {
      await Put({
        url: `/advertisement/advertisement/${selectedAd.id}`,
        data: formData,
        headers,
      });

      // Reset form fields
      setSection1("");
      setSection2("");
      setValue("");
      setSelectedFile(null);
      setFilePreview(null);

      setReload(true);
      message.success("Advertisement modified successfully!");
      handleCancel(); // Close the modal
    } catch (error) {
      console.error("Error:", error);
      message.error("Error modifying advertisement.");
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
          value={section1} // Set default value
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
          value={section2} // Set default value
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
        <div className="flex flex-col my-3 gap-4">
          <Form.Item label="Upload File">
            <input type="file" onChange={handleUpload} />
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
      </div>
      <Button type="primary" onClick={handleSubmit} className="bg-blue-500">
        Modify Advertisement
      </Button>
    </div>
  );
}
