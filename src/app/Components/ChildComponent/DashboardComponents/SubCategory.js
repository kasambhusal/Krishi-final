"use client";
import React, { useState } from "react";
import { Button } from "antd";
import { Modal } from "antd";
import SubCategoryTable from "./SubCategoryTable";
import SubCategoryAdd from "./SubCategoryAdd";

export default function SubCategory() {
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
            Add Sub Category{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Create Sub  Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer=""
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
          >
            <SubCategoryAdd handleCancel={handleCancel} setReload={setReload} />
          </Modal>
        </h2>
        <SubCategoryTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
