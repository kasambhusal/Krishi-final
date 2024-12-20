"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import AdminAdd from "./AuthorAdd";
import AuthorsTable from "./AuthorsTable";

export default function Authors() {
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
            Add Author{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Add Author"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer=""
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
            style={{ minWidth: "55vw" }}
          >
            <AdminAdd setReload={setReload} handleCancel={handleCancel} />
          </Modal>
        </h2>
        <AuthorsTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
