import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
import { Put } from "../../Redux/API";

const FloatingLabelInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);

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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!value)}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};

const AuthorModify = ({ modifyObj, fetchData, handleCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    address: "",
    social_media_url: "",
    author_email: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lge } = useNavigation();

  useEffect(() => {
    if (modifyObj) {
      setFormData({
        name: modifyObj.name,
        phone_no: modifyObj.phone_no,
        address: modifyObj.address,
        social_media_url: modifyObj.social_media,
        author_email: modifyObj.email,
      });
    }
  }, [modifyObj]); // This runs when modifyObj changes

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Start submission

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("language", lge);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });
    if (selectedFile) {
      formDataToSubmit.append("image", selectedFile);
    }

    // Validation
    if (!formData.phone_no.startsWith("9") || formData.phone_no.length < 10) {
      message.error("Enter a valid phone number");
      setIsSubmitting(false); // Reset submission state
      return;
    }

    try {
      const response = await Put({
        url: `/author/author/${modifyObj.id}`,
        data: formDataToSubmit,
        headers,
      });
      if (response) {
        message.success("Author modified successfully!");
        fetchData(); // Fetch updated data
        handleCancel(); // Close the modal or reset state
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      message.error("Failed to modify author!");
    } finally {
      setIsSubmitting(false); // Always reset submission state
    }
  };
  // useEffect(() => {
  //   // The submit logic can be invoked here when necessary,
  //   // but we need to make sure we depend on the correct values.
  //   if (
  //     formData.name &&
  //     formData.phone_no &&
  //     formData.address &&
  //     formData.social_media_url &&
  //     formData.author_email
  //   ) {
  //     handleSubmit();
  //   }
  // }, [
  //   formData,
  //   handleCancel,
  //   isSubmitting,
  //   lge,
  //   modifyObj.id,
  //   fetchData,
  //   selectedFile,
  // ]); // Adding dependencies to track changes

  return (
    <div className="w-full flex justify-center">
      <div className="w-11/12 my-5 flex flex-col gap-5">
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

        <Form.Item>
          <input type="file" onChange={handleImageChange} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting} // Show loading indicator
            className="bg-blue-500"
          >
            Submit
          </Button>
        </Form.Item>
      </div>
    </div>
  );
};

export default AuthorModify;
