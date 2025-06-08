"use client";
import React, { useState } from "react";
import { Button, Modal, Switch } from "antd";
import NewsAdd from "./NewsAdd";
import NewsTable from "./NewsTable";
import { useTheme } from "../../Context/ThemeContext";
import CustomLoader from "../Others/CustomLoader";

export default function News() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const { themeColor } = useTheme();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (checked) => {
    setIsActive(checked);
    setReload(true); // Trigger a reload when the filter changes
  };

  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "95%" }}>
        <div className="w-full flex justify-between items-center my-3">
          <div className="flex items-center flex-wrap">
            <div className=" flex items-center">
              <h2 className="mr-2">Active / Draft : </h2>
              <Switch
                defaultChecked
                onChange={handleFilterChange}
                checkedChildren="Active"
                unCheckedChildren="Draft"
                style={{
                  backgroundColor: themeColor, // Dark green color when checked
                }}
              />
            </div>
          </div>
          <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            onClick={showModal}
          >
            Add News{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
        </div>
        <Modal
          title="Create News"
          open={isModalOpen}
          onOk={handleOk}
          okText="Submit"
          okButtonProps={{
            style: { color: "black", border: "1px solid #bdbbbb" },
          }}
          onCancel={handleCancel}
          style={{ minWidth: "80vw" }}
          footer={null}
        >
          <NewsAdd handleCancel2={handleCancel} setReload={setReload} />
        </Modal>
        <NewsTable reload={reload} setReload={setReload} isActive={isActive} />
      </div>
    </div>
  );
}
