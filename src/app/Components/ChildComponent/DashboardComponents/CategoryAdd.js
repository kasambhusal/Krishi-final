"use client";
import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
import { Post } from "../../Redux/API";

const FloatingLabelInput = ({ label, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <Form.Item
      className={`floating-label-input ${focused || value ? "focused" : ""} w-full`}
    >
      <label>{label}</label>
      <Input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(!!value)}
        placeholder=""
      />
    </Form.Item>
  );
};

export default function CategoryAdd({ handleCancel, setReload }) {
  const { lge } = useNavigation();
  const [categoryName, setCategoryName] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = () => {
    if (!categoryName || !displayOrder) {
      message.error("Please fill in all required fields.");
      return;
    }

    const values = {
      category_name: categoryName,
      display_order: displayOrder,
      language: lge,
      active,
    };

    const token = localStorage.getItem("Token");
    if (!token) {
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true); // Set loading to true
    Post({ url: "/category/category", data: values, headers })
      .then(() => {
        message.success("Category added successfully");
        resetFields();
        handleCancel();
        setReload(true);
      })
      .catch((error) => {
        console.error("Request failed:", error);
        message.error("Check fields or try again later!");
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request
      });
  };

  const resetFields = () => {
    setCategoryName("");
    setDisplayOrder("");
    setActive(false);
  };

  return (
    <div className="w-full flex justify-center">
      <Form className="w-full" onFinish={handleSubmit}>
        <div style={{ width: "90%" }} className="my-5 flex flex-col gap-[20px]">
          <FloatingLabelInput
            label="Category Name*"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <FloatingLabelInput
            label="Display Order*"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
          <Form.Item label="Language">
            <Input
              value={lge}
              disabled
              className="text-[#878684] cursor-not-allowed"
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            >
              Category Active
            </Checkbox>
          </Form.Item>
        </div>
        <div className="w-full flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500"
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
