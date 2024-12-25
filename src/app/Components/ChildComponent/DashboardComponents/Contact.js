"use client";
import React, { useEffect } from "react";
import ContactTable from "./ContactTable";
import { Get } from "../../Redux/API";

export default function Contact() {
  useEffect(() => {
    const fetchGallery = async () => {
      const token = localStorage.getItem("Token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = Get({ url: "/gallery/image-gallery", headers });
        console.log(JSON.stringify(response));
      } catch (error) {
        console.error(error);
      }
    };
    fetchGallery();
  }, []);
  return (
    <div className="flex justify-center items-center">
      <div style={{ width: "85%" }}>
        <ContactTable />
      </div>
    </div>
  );
}
