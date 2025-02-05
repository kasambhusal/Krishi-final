"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Get } from "../../Redux/API";
import { useTheme } from "../../Context/ThemeContext";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BottomNav = () => {
  const [searchValue, setSearchValue] = useState("");
  const { themeColor } = useTheme();
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const router = useRouter();
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [url, setUrl] = useState("");
  const [lge, setLge] = useState(pathname.includes("/en") ? "en" : "np");
  const showDrawer = () => {
    if (window.innerWidth < 1024) {
      setOpen(true);
    }
  };
  const showDrawer2 = () => {
    setOpen2(true);
  };
  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if in a form
      searched();
    }
  };
  useEffect(() => {
    if (lge === "en") {
      setUrl("/en");
    } else {
      setUrl("");
    }
  }, [lge]);

  const onClose2 = () => {
    setOpen2(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   console.log('Current language:', lge);
  // }, [lge]);

  const fetchData = async () => {
    try {
      const response = await Get({ url: "/public/category/get-category" });
      const filteredResponse = response
        .filter(
          (item) =>
            item.active === true &&
            item.language === lge &&
            item.active === true
        )
        .sort((a, b) => a.display_order - b.display_order);
      setCategories(filteredResponse);
    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error(error.message);
      if (error.message === "Not responding") {
        return <ServerNotResponding />;
      }
    }
  };
  // const scrollToTop = () => {
  //   if (typeof window !== "undefined") {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  const onClose = () => {
    setOpen(false);
  };

  const handleMouseEnter = (categoryId) => {
    clearTimeout(timeoutId);
    setHoveredCategoryId(categoryId);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setHoveredCategoryId(null), 500);
    setTimeoutId(id);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const searched = () => {
    onClose2(false);
    if (searchValue.trim() !== "") {
      router.push(
        lge === "en" ? `/en/search/${searchValue}` : `/search/${searchValue}`
      );
    }
  };
  const capitalize = (str) => {
    const mystr = str === "en" ? "nep" : "eng";
    if (!mystr) return ""; // Handle empty strings
    return mystr.charAt(0).toUpperCase() + mystr.slice(1);
  };
  const toggleLanguage = () => {
    const ln = lge === "en" ? "" : "en";
    window.open(`https://krishisanjal.com/${ln}`, "_blank");
  };
  const toggleCategory = (categoryId) => {
    setOpenCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
  };
  return (
    <div
      className={`top-0 z-50  h-[60px] w-full flex items-center  ${isScrolled ? "justify-between lg:pr-5 lg:pl-0" : "lg:px-10 justify-end lg:justify-start"} `}
      style={{ backgroundColor: themeColor }}
    >
      {/* <ToastContainer position="top-right" autoClose={5000} /> */}
      {isScrolled && (
        <div
          style={{
            // position: "absolute",
            // top: "100px",
            // left: "60px",
            height: "60px",

            backgroundColor: "white",
          }}
          className="flex"
        >
          <Image
            src="/logo.png"
            className="w-100px h-[50px] hidden lg:block cursor-pointer"
            width={150}
            height={50}
            alt="logo"
            onClick={() => {
              router.push("/");
              // scrollToTop();
            }}
          />
        </div>
      )}
      <ul
        className={`flex overflow-visible justify-end pr-4 lg:justify-between  h-full items-center !font-medium !font-mukta !text-lg gap-1 ${isScrolled ? "w-[80%]" : "w-full"}`}
      >
        <li
          className=" hidden lg:flex "
          // onClick={scrollToTop}
        >
          <Link
            href={lge === "en" ? "/en" : "/"}
            className="hidden lg:flex items-center justify-center gap-1 text-white/90 text-[18px] hover:text-white duration-150 group"
          >
            {lge === "en" ? <p>Home</p> : <p>होमपेज</p>}
          </Link>
        </li>
        {isScrolled && (
          <div
            style={{
              position: "absolute",
              left: "10px",
              height: "60px",

              backgroundColor: "white",
            }}
            className="flex items-center justify-center top-[200px] sm:top-[120px]"
          >
            <Image
              src="/logo.png"
              className="max-w-100px h-[50px] block lg:hidden "
              width={150}
              height={50}
              alt="logo"
              onClick={() => {
                router.push("/");
                // scrollToTop();
              }}
            />
          </div>
        )}
        <div className="relative flex w-full justify-evenly h-full">
          {categories.slice(0, 6).map((category, index) => (
            <React.Fragment key={category.id}>
              <li
                className="relative group hidden lg:flex h-full"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
                // onClick={scrollToTop}
                key={category.id} // Ensure each category has a unique key
              >
                <Link
                  className="flex items-center justify-center gap-1 text-white/90 text-[18px] font-mukta hover:text-white duration-150"
                  href={`${url}/${category.category_name}`}
                >
                  <span className="flex items-center gap-1 ">
                    {category.category_name}
                    {category.category_key.length > 0 && (
                      <FaAngleDown className="ml-1" />
                    )}
                  </span>
                </Link>

                {/* Subcategories */}
                {hoveredCategoryId === category.id &&
                  category.category_key.length > 0 && (
                    <div className="absolute top-[50px] left-0 z-20 min-w-[200px] bg-green-100 rounded-md shadow-lg mt-2">
                      <ul className="flex flex-col">
                        {category.category_key
                          .filter((subcategory) => subcategory.active === true)
                          .map((subcategory) => (
                            <li
                              key={subcategory.id}
                              // onClick={scrollToTop}
                            >
                              <Link
                                href={`${url}/${subcategory.category_key_name}`}
                                className="text-black/90 text-center text-[16px] hover:text-white px-2 py-1 hover:bg-[#12801e] block"
                              >
                                {subcategory.category_key_name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </li>
              {index === 3 && (
                <li
                  // onClick={scrollToTop}
                  className="relative group hidden lg:flex h-full"
                >
                  <Link
                    href={lge === "en" ? "/en/table" : "/table"}
                    // onClick={scrollToTop}
                    className="flex items-center justify-center text-white/90 text-[18px] font-mukta hover:text-white duration-150"
                  >
                    {lge === "en" ? (
                      <p>Market</p>
                    ) : (
                      <h2>{lge === "en" ? <p>Market</p> : <p>बजार</p>}</h2>
                    )}
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </div>

        <li>
          <div className="hidden lg:flex items-center">
            <div
              className={`relative m-2 rounded-full  ${isScrolled ? "hidden" : "flex"}  overflow-hidden  justify-center items-center h-full bg-white`}
            >
              <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search news..."
                className="w-full bg-transparent shadow px-4 pr-10 rounded-full border border-gray-400 py-1.5 font-light !text-sm"
              />
              <IoSearch
                className="absolute right-2.5 cursor-pointer"
                onClick={searched}
              />
            </div>
            <Button
              className="bg-[#2d5e29] text-white font-bold h-[40px] w-[40px] hover:bg-green-500"
              style={{ border: "1px solid #ccc4c4", borderRadius: "100%" }}
              onClick={toggleLanguage}
            >
              {capitalize(lge)}
            </Button>
          </div>
          <div className="flex items-center  lg:hidden justify-center gap-4">
            <Button
              className="bg-[#2d5e29] text-white font-bold h-[40px] w-[40px] hover:bg-green-500"
              style={{ border: "1px solid #ccc4c4", borderRadius: "100%" }}
              onClick={toggleLanguage}
            >
              {capitalize(lge)}
            </Button>
            <SearchOutlined
              className="text-white text-xl"
              onClick={showDrawer2}
            />
            <MenuOutlined className="text-white text-xl" onClick={showDrawer} />
          </div>
        </li>
      </ul>
      <Drawer
        placement="top"
        closable={false}
        onClose={onClose2}
        open={open2}
        key="top"
        height={80}
      >
        <div className="w-full h-full flex justify-center items-center">
          <div
            className={`relative rounded-full  flex overflow-hidden flex justify-center items-center h-full bg-white`}
          >
            <input
              type="text"
              value={searchValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full bg-transparent shadow px-4 pr-10  rounded-full border border-gray-400 py-1.5 font-light !text-sm"
            />
            <IoSearch
              className="absolute right-2.5 cursor-pointer"
              onClick={searched}
            />
          </div>
        </div>
      </Drawer>
      <Drawer
        title={lge === "en" ? "Menu" : "मेनु"}
        onClose={onClose}
        open={open}
      >
        <ul className="h-full flex flex-col gap-[20px]">
          <li
          // onClick={scrollToTop}
          >
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center font-bold justify-center gap-1 text-black/90 text-[22px] hover:black-white duration-150"
            >
              {lge === "en" ? <p>Home</p> : <p>होमपेज</p>}
            </Link>
          </li>
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <li>
                <div className="flex justify-center gap-[7px]">
                  <Link
                    className="flex items-center justify-center gap-1 font-bold text-black/90 text-[22px]  duration-150"
                    href={`${url}/${category.category_name}`}
                    onClick={onClose}
                  >
                    {category.category_name}
                  </Link>{" "}
                  <span
                    className="flex items-center gap-1"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.category_key.length > 0 && (
                      <FaAngleDown
                        className="ml-1"
                        style={{ fontSize: "20px" }}
                      />
                    )}
                  </span>
                </div>
                {openCategoryId === category.id &&
                  category.category_key.length > 0 && (
                    <div className="min-w-[120px] bg-green-100">
                      <ul className="flex flex-col items-center">
                        {category.category_key.map((subcategory) => (
                          <li
                            key={subcategory.key}
                            // onClick={scrollToTop}
                          >
                            <Link
                              href={`${url}/${subcategory.category_key_name}`}
                              className="text-black/90 text-[20px] hover:text-white px-2 py-1 block"
                              onClick={onClose}
                            >
                              {subcategory.category_key_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </li>
              {/* Render something special for the third category */}
              {index === 3 && (
                <li
                //  onClick={scrollToTop}
                >
                  <Link
                    href={lge === "en" ? "/en/table" : "/table"}
                    onClick={onClose}
                    className="flex items-center justify-center font-bold gap-1 text-black/90 text-[22px] hover:black-white duration-150"
                  >
                    {lge === "en" ? (
                      <p>Market</p>
                    ) : (
                      <h2>{lge === "en" ? <p>Market</p> : <p>बजार</p>}</h2>
                    )}
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </Drawer>
    </div>
  );
};

export default BottomNav;
