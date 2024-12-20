"use client";
import React, { useState } from "react";
import VideoTable from "./VideoTable";
import { Button } from "antd";
import { Modal } from "antd";
import VideoAdd from "./VideoAdd";

export default function Video() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
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
      <div style={{ width: "85%" }}>
        <h2 className="width-100" style={{ textAlign: "right" }}>
          <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            className="my-3"
            onClick={showModal}
          >
            Add Video{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Create Video"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Add"
            okButtonProps={{
              style: { color: "black" }, // Add custom styles here
            }}
            footer=""
          >
            <VideoAdd handleCancel={handleCancel} setReload={setReload} />
          </Modal>
        </h2>
        <VideoTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
