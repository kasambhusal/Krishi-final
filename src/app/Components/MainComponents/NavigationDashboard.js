"use client";
import React, { useState } from "react";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Popover } from "antd";
import { Select } from "antd";
import { useNavigation } from "../Context/NavigationContext";
import SideBar from "../ChildComponent/Others/SideBar";
import { Post } from "../Redux/API";
import { message } from "antd";
import { useNewsSearch } from "../Context/searchNewsContext";
import { useRouter } from "next/navigation";
import { Drawer } from "antd";
import { CloseOutlined } from "@mui/icons-material";
import Link from "next/link";

export default function Navigation({ open, setOpen }) {
  const { lge, setLge } = useNavigation();
  const { setSearchValue } = useNewsSearch();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const logout = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Post({ url: "/user/logout/", headers });
      localStorage.removeItem("Token");
      message.success("Successfully logged out");
      router.push("/dashboard/login");
    } catch (error) {
      message.error("Error on logout");
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [popOpen, setPopOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: "np",
    label: "Nepali",
  });

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setLge(selectedOption);
  };

  const hide = () => {
    setPopOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setPopOpen(newOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setSearchValue(search);
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      style={{ minHeight: "15vh", backgroundColor: "#0c3d18" }}
      className="grid grid-cols-4 w-full"
    >
      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        title=""
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
        style={{
          background: "#20452a",
          color: "white",
        }}
      >
        <SideBar setOpen={setOpen} />
      </Drawer>
      <div className="col-span-2 md:col-span-1 flex items-center justify-center">
        <Link href={lge === "en" ? "/en" : "/"}>
          <Image
            src="/logo.png"
            alt="logo"
            //   style={{ width: "200px", height: "70%" }}
            width={200}
            height={100}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="col-span-2 hidden md:flex items-center justify-center">
        <div className="flex w-full items-center">
          <input
            className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-green-100 border-0 rounded-l-md focus:placeholder-gray-500 focus:bg-blue-50 focus:border-purple-300 focus:outline-none focus:shadow-outline-purple h-10"
            type="text"
            value={search}
            placeholder="Search here...."
            onKeyDown={handleKeyDown}
            aria-label="Search"
            onChange={searchChange}
          />
          <button
            className="bg-green-500 text-white rounded-r-md px-4 h-10"
            onClick={handleSubmit}
          >
            <SearchOutlined />
          </button>
        </div>
      </div>
      <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-[10px] md:gap-[20px]">
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={[
            { value: "en", label: "English" },
            { value: "np", label: "Nepali" },
          ]}
        />
        <Popover
          content={
            <div>
              <div
                className="text-xl font-mukta flex items-center gap-[5px] hover:bg-green-900 hover:text-white p-[10px] cursor-pointer"
                onClick={logout}
              >
                <LogoutOutlined type="primary" style={{ fontSize: "25px" }} />
                SignOut
              </div>
            </div>
          }
          trigger="click"
          open={popOpen}
          onOpenChange={handleOpenChange}
        >
          <LogoutOutlined
            type="primary"
            style={{ fontSize: "25px", color: "white" }}
          />
        </Popover>
        <MenuUnfoldOutlined
          type="primary"
          style={{ fontSize: "25px", color: "white" }}
          onClick={showDrawer}
        />
      </div>
    </div>
  );
}
