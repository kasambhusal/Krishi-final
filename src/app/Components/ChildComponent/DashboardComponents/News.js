"use client";
import React, { useState } from "react";
import { Button } from "antd";
import { Modal } from "antd";
import NewsAdd from "./NewsAdd";
import NewsTable from "./NewsTable";
import { useRouter } from "next/navigation";

export default function News() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "95%" }}>
        <h2 className="w-full text-right">
          <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            className="my-3"
            onClick={showModal}
          >
            Add News{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Create News"
            open={isModalOpen}
            onOk={handleOk}
            okText="Submit"
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
            onCancel={handleCancel}
            style={{ minWidth: "80vw" }}
            footer={null}
          >
            <NewsAdd handleCancel2={handleCancel} setReload={setReload} />
          </Modal>
        </h2>
        <NewsTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
