"use client";
import React, { useState } from "react";
import CategoryTable from "./CategoryTable";
import { Button } from "antd";
import { Modal } from "antd";
import CategoryAdd from "./CategoryAdd";

export default function Category() {
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
            Add Category{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Create Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Add"
            okButtonProps={{
              style: { color: "black" }, // Add custom styles here
            }}
            footer=""
          >
            <CategoryAdd handleCancel={handleCancel} setReload={setReload} />
          </Modal>
        </h2>
        <CategoryTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
