"use client";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Form, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { Put } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

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
      className={`floating-label-input ${focused || value ? "focused" : ""} w-full`}
      style={{ width: "300px" }}
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
      />
    </Form.Item>
  );
};

export default function MemberModify({ fetchData, handleCancel, modifyObj }) {
  // State for form fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [socialMediaUrl, setSocialMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for image
  const [imagePreview, setImagePreview] = useState(""); // State for image preview
  const [lge, setLge] = useState("");

  useEffect(() => {
    if (modifyObj) {
      setName(modifyObj.name);
      setDesignation(modifyObj.designation);
      setDisplayOrder(modifyObj.display_order);
      setSocialMediaUrl(modifyObj.social_media_url || ""); // Handle potential undefined
      setDescription(modifyObj.description || "");
      setLge(modifyObj.lge);
    }
  }, [modifyObj]);

  const handleImageChange = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
    return false; // Prevent automatic upload
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("language", lge);
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("social_media_url", socialMediaUrl);
    formData.append("description", description);
    formData.append("display_order", displayOrder);
    if (imageFile) {
      formData.append("image", imageFile); // Include the new image file
    } else if (modifyObj && modifyObj.img) {
      // If no new image, and modifying existing, append the current image URL
      formData.append("image", modifyObj.img);
    }
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      console.log(modifyObj.key);
      const url = `/member/member/${modifyObj.key}`;

      await Put({ url, headers, data: formData });
      message.success("Member modified successfully");
      handleCancel();
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error processing member data!");
    }
  };

  return (
    <div className="my-7">
      <FloatingLabelInput
        label="Name of member*"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FloatingLabelInput
        label="Designation*"
        name="designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      />
      <Input value={lge} disabled className="mb-5" />
      <FloatingLabelInput
        label="Display Order*"
        name="order"
        value={displayOrder}
        onChange={(e) => setDisplayOrder(e.target.value)}
      />
      <FloatingLabelInput
        label="Social Media Link"
        name="link"
        value={socialMediaUrl}
        onChange={(e) => setSocialMediaUrl(e.target.value)}
      />
      <Form.Item label="Description">
        <Input.TextArea
          name={name}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </Form.Item>
      <Form.Item label="Upload Image (optional)">
        <Upload
          beforeUpload={handleImageChange}
          accept=".jpg,.png,.jpeg"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={100} // Specify width
            height={100} // Specify height
            style={{
              marginTop: 16,
              objectFit: "cover", // Ensures image aspect ratio is maintained
            }}
          />
        )}
      </Form.Item>
      <div className="w-full flex justify-end">
        <Button className="bg-blue-500" onClick={handleSubmit}>
          {modifyObj ? "Update" : "Post"}
        </Button>
      </div>
    </div>
  );
}
