"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message, Select } from "antd";
import { Put } from "../../Redux/API";

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

export default function CategoryModify({ modifyObj, fetchData, handleCancel }) {
  const [categoryName, setCategoryName] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [lge, setLge] = useState(""); // Language state
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (modifyObj) {
      setCategoryName(modifyObj.category_name);
      setDisplayOrder(modifyObj.display_order);
      setActive(modifyObj.active);
      setLge(modifyObj.lge); // Set default language from modifyObj
    }
  }, [modifyObj]);

  const handleSubmit = () => {
    if (!categoryName || !displayOrder) {
      message.error("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("Token");
    if (!token) {
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("category_name", categoryName);
    formDataToSubmit.append("display_order", displayOrder);
    formDataToSubmit.append("language", lge);
    formDataToSubmit.append("active", active);

    setLoading(true); // Set loading to true
    Put({
      url: `/category/category/${modifyObj.key}`,
      data: formDataToSubmit,
      headers,
    })
      .then(() => {
        message.success("Category modified successfully");
        resetFields();
        handleCancel();
        fetchData();
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
    setLge(""); // Reset language as well
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
            <Select
              value={lge}
              onChange={setLge}
              options={[
                { label: "English", value: "en" },
                { label: "Nepali", value: "np" },
              ]}
              style={{ width: "100%" }}
              placeholder="Select Language" // Placeholder to show when no option is selected
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
