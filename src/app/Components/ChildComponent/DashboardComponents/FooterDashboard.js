"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import FooterDashboardTable from "./FooterDashboardTable";
import MemberAdd from "./MemberAdd";
import { Form } from "antd";

const FloatingLabelInput = ({ label, name, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(!!value);

  return (
    <Form.Item
      className={`floating-label-input ${focused || value ? "focused" : ""} w-full`}
    >
      <label htmlFor={name}>{label}</label>
      <textarea
        className="p-5"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={10}
        cols={60}
      />
    </Form.Item>
  );
};

export default function FooterDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [reload, setReload] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "85%" }}>
        <h2 className="width-100" style={{ textAlign: "right" }}>
          {/* <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            className="my-3"
            onClick={showModal2}
          >
            Logo Text <ion-icon name="create-outline"></ion-icon>
          </Button> */}
          <Button
            style={{ color: "white", backgroundColor: "#0d2914" }}
            className="my-3"
            onClick={showModal}
          >
            Add Member{" "}
            <ion-icon name="add-outline" style={{ color: "white" }}></ion-icon>
          </Button>
          <Modal
            title="Add members"
            open={isModalOpen}
            onOk={handleOk}
            footer=""
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
            onCancel={handleCancel}
          >
            <MemberAdd handleCancel={handleCancel} setReload={setReload} />
          </Modal>
          <Modal
            className="py-5"
            title="Edit Logo Text"
            open={isModalOpen2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            okButtonProps={{
              style: { color: "black", border: "1px solid #bdbbbb" }, // Add custom styles here
            }}
          >
            <div className="my-5"></div>
            <div className="w-[200px] sm:w-full">
              <FloatingLabelInput label="Edit text" name="text" />
            </div>
          </Modal>
        </h2>
        <FooterDashboardTable reload={reload} setReload={setReload} />
      </div>
    </div>
  );
}
