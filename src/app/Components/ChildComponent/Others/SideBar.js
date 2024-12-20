"use client";
import React, { useState } from "react";
import Link from "next/link";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { BsFillCircleFill } from "react-icons/bs";
import { FaChalkboardTeacher, FaVideo } from "react-icons/fa";
import { MdPermContactCalendar } from "react-icons/md";
import { Drawer } from "antd";
import { RiAdvertisementFill } from "react-icons/ri";
import { CloseOutlined } from "@mui/icons-material";
import { TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const SideBar = ({ setOpen }) => {
  //   const [subCategoryShow, setSubCategoryShow] = useState(false);
  const { pathname } = useRouter();
  const location = pathname;

  //   const toggleSubCategory = () => setSubCategoryShow((prev) => !prev);

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      label: "Category",
      to: "/dashboard/category",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
      //   children: [
      //     { to: "/dashboard/category", label: "Categories" },
      //     { to: "/dashboard/sub-category", label: "Sub-Categories" },
      //   ],
      //   show: subCategoryShow,
      //   toggleShow: toggleSubCategory,
    },
    {
      label: "Sub Category",
      to: "/dashboard/sub-category",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
    },
    {
      to: "/dashboard/authors",
      label: "Authors",
      icon: <FaChalkboardTeacher className="text-xl" />,
    },
    {
      to: "/dashboard/contact",
      label: "Contact",
      icon: <MdPermContactCalendar className="text-xl" />,
    },
    {
      to: "/dashboard/news",
      label: "News",
      icon: <NewspaperIcon />,
    },
    {
      to: "/dashboard/advertisement",
      label: "Advertisement",
      icon: <RiAdvertisementFill className="text-[19px]" />,
    },
    {
      to: "/dashboard/footer",
      label: "Team",
      icon: <TeamOutlined className="text-[19px]" />,
    },
    {
      to: "/dashboard/video",
      label: "Video",
      icon: <FaVideo className="text-[19px]" />,
    },
  ];

  return (
    <div className="md:py-4 text-gray-300 z-3">
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <ul className="mt-2">
            <li className="relative px-6 py-[6px] hover:bg-[#4b4a4ac5]">
              <Link
                className={`inline-flex items-center p-2 rounded-md w-full text-sm font-medium transition-colors duration-150 hover:text-white ${
                  location === item.to ? `bg-[#4b4a4ac5]` : ""
                }`}
                href={item.to}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-4">{item.label}</span>
                {/* {item.children && (
                  <>
                    {item.show ? (
                      <IoIosArrowUp className="text-lg cursor-pointer absolute right-4" />
                    ) : (
                      <IoIosArrowDown className="text-lg cursor-pointer absolute right-4" />
                    )}
                  </>
                )} */}
              </Link>
            </li>
            {/* {item.children && item.show && (
              <ul className="relative px-6 pb-2 ml-3">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <Link
                      className={`inline-flex items-center hover:bg-[#4b4a4ac5] w-full text-sm font-medium transition-colors duration-150 p-2 rounded-md hover:text-white ${
                        location === child.to ? `bg-[#4b4a4ac5]` : ""
                      }`}
                      href={child.to}
                    >
                      <BsFillCircleFill className="text-[5px] mr-1 ml-5" />
                      <span className="ml-1 text-[13px]">{child.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )} */}
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideBar;
