"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
import { Post } from "../../Redux/API";

const FloatingLabelInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(!!value);

  return (
    <Form.Item
      className={`floating-label-input ${focused || value ? "focused" : ""}`}
      style={{ width: "100%" }}
    >
      <label htmlFor={name}>{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};

const AuthorAdd = ({ setReload, handleCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    address: "",
    social_media_url: "",
    author_email: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { lge } = useNavigation(); // Assume this provides the current language context

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Call handleSubmit initially when useEffect runs
    if (
      formData.name &&
      formData.phone_no &&
      formData.address &&
      formData.social_media_url &&
      formData.author_email
    ) {
      handleSubmit();
    }
  }, [formData, handleCancel, lge, selectedFile, setReload]); // Add missing dependencies here
  const handleSubmit = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("language", lge);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });
    if (selectedFile) {
      formDataToSubmit.append("image", selectedFile); // Append the image file
    }
    if (!formData.phone_no.startsWith("9") || formData.phone_no.length < 10) {
      message.error("Enter Valid Phone number");
      return;
    }
    try {
      const response = await Post({
        url: "/author/author",
        data: formDataToSubmit,
        headers: {
          ...headers,
          // "Content-Type": "multipart/form-data", // Do NOT set this header manually
        },
      });

      message.success("Author added successfully!");
      setReload(true);
      // Reset form fields
      setFormData({
        name: "",
        phone_no: "",
        address: "",
        social_media_url: "",
        author_email: "",
      });
      setSelectedFile(null);
      handleCancel();
    } catch (error) {
      console.error("Error submitting data:", error);
      message.error("Failed to add author!");
    }
  };
  return (
    <div className="w-full flex justify-center">
      <div className="w-11/12 my-5 flex flex-col gap-5">
        <div className="w-full">
          <FloatingLabelInput
            label="Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input value={lge} disabled className="mb-5" />
          <FloatingLabelInput
            label="Phone Number*"
            name="phone_no"
            type="text"
            value={formData.phone_no}
            onChange={handleChange}
          />
          <FloatingLabelInput
            label="Address*"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FloatingLabelInput
            label="Social Media URL*"
            name="social_media_url"
            value={formData.social_media_url}
            onChange={handleChange}
          />
          <FloatingLabelInput
            label="Email*"
            name="author_email"
            type="email"
            value={formData.author_email}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Form.Item>
            <input type="file" onChange={handleImageChange} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-blue-500"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default AuthorAdd;
