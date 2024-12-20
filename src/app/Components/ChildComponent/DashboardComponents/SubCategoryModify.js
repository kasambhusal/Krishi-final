"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigation } from "../../Context/NavigationContext";
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

export default function SubCategoryModify({
  modifyObj,
  fetchData,
  handleCancel,
}) {
  const { lge } = useNavigation();
  const [subcategoryName, setSubCategoryName] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (modifyObj) {
      setSubCategoryName(modifyObj.category_key_name);
      setActive(modifyObj.active);
    }
  }, [modifyObj]);

  const handleSubmit = () => {
    if (!subcategoryName) {
      message.error("Please fill in all required fields.");
      return;
    }

    const values = {
      category_key_name: subcategoryName,
      language: lge,
      active,
      category: modifyObj.category,
    };

    setLoading(true); // Set loading to true
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    Put({
      url: `/category/sub-category/${modifyObj.key}`,
      data: values,
      headers,
    })
      .then(() => {
        message.success("Subcategory modified successfully");
        fetchData();
        handleCancel();
      })
      .catch((error) => {
        console.error("Request failed:", error);
        message.error(error.message);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after request
      });
  };

  return (
    <div className="w-full flex justify-center">
      <Form className="w-full" onFinish={handleSubmit}>
        <div style={{ width: "90%" }} className="my-5 flex flex-col gap-[20px]">
          <FloatingLabelInput
            label="Sub-category Name*"
            value={subcategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
          <Form.Item>
            <Checkbox
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            >
              Subcategory Active
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
