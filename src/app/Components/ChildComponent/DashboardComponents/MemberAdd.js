"use client";
import { Button, Input, Form } from "antd";
import React, { useState } from "react";
import { message } from "antd";
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
        width={500}
      />
    </Form.Item>
  );
};

// New TextArea component
const FloatingLabelTextArea = ({ label, name, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(!!value);

  return (
    <Form.Item
      className={`floating-label-input ${focused || value ? "focused" : ""} w-full`}
      style={{}}
    >
      <label htmlFor={name}>{label}</label>
      <Input.TextArea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={4}
      />
    </Form.Item>
  );
};

export default function MemberAdd({ setReload, handleCancel }) {
  const { lge } = useNavigation();

  // State for form fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [socialMediaUrl, setSocialMediaUrl] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for image
  const [description, setDescription] = useState(""); // State for textarea

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("language", lge);
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("social_media_url", socialMediaUrl);
    formData.append("display_order", displayOrder);
    formData.append("description", description); // Include the description
    if (imageFile) {
      formData.append("image", imageFile); // Include the image file
    }
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Post({ url: "/member/member", headers, data: formData });
      message.success("Member added successfully");

      // Resetting the form fields
      setName("");
      setDesignation("");
      setDisplayOrder("");
      setSocialMediaUrl("");
      setImageFile(null);
      setDescription("");

      handleCancel();
      setReload(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error on member adding !!!");
    }
  };

  return (
    <div>
      <div className="my-5 w-full"></div>
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
      <div className="flex justify-between">
        <Input value={lge} disabled className="mb-5 w-[50px]" />
        <FloatingLabelInput
          label="Display Order*"
          name="order"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
        />
      </div>
      <FloatingLabelInput
        label="Social Media Link"
        name="link"
        value={socialMediaUrl}
        onChange={(e) => setSocialMediaUrl(e.target.value)}
      />
      <Form.Item label="Upload Image">
        <input
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={handleImageChange}
        />
      </Form.Item>

      {/* TextArea for Description */}
      <FloatingLabelTextArea
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="w-full flex justify-end">
        <Button className="bg-blue-500" onClick={handleSubmit}>
          Post
        </Button>
      </div>
    </div>
  );
}
