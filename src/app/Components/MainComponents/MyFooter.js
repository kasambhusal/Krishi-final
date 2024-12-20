"use client";
import React, { useEffect, useState } from "react";
import Contact from "../ChildComponent/Others/Contact";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Get } from "../Redux/API";
import { useTheme } from "../Context/ThemeContext";
import Image from "next/image";

const MyFooter = () => {
  // const scrollToTop = () => {
  //   if (typeof window !== "undefined") {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth", // Smooth scrolling
  //     });
  //   }
  // };

  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeColor } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await Get({ url: "/public/member/get-members" });
        const filteredResponse = response.sort(
          (a, b) => a.display_order - b.display_order
        ); // Sorting in descending order by display order
        setMembers(filteredResponse);
      } catch (error) {
        console.error("Error in category fetch: " + error);
        setMembers([]); // Reset members in case of error
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchMember();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Assuming lg breakpoint is 1024px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []); // Empty dependency array means this effect runs once on mount

  const handlePhoneClick = (phoneNumber) => {
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      navigator.clipboard
        .writeText(phoneNumber)
        .then(() => {
          alert("Phone number copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <hr
        className="my-10"
        style={{
          flex: 1,
          border: "none",
          borderTop: "2px solid #999c98",
        }}
      />
      <div style={{ width: "95%", margin: "50px auto" }}>
        <div className="grid grid-cols-4">
          <div className="col-span-4 lg:col-span-1 md:col-span-2 flex items-center">
            <div className="p-[20px] flex flex-col justify-center gap-[10px] item-center">
              <Image
                src="/logo.png"
                alt="Krishi_Sanjal logo"
                onClick={() => router.push("/")}
                width={250}
                height={80}
                loading="lazy"
              />
              <p className="font-bold w-full text-center">
                कृषि सञ्चारको संवाहक
              </p>
              <hr className="h-[4px] bg-black-700 mt-2" />
              <p className="font-bold">सूचना विभाग दर्ता नं: ४२४६-२०८०/८१</p>
              <p className="font-bold">+977-9855034935</p>
              <p className="font-bold">info.krishisanjal@gmail.com</p>
              <Contact />
            </div>
            <div
              className="lg:block hidden"
              style={{
                height: "90%",
                width: "50px",
                borderLeft: "1px solid #7a7979",
              }}
            ></div>
          </div>
          <div className="col-span-4 lg:col-span-3 md:col-span-2 grid-rows-2">
            <div className="row-span-1">
              <div className="grid grid-cols-4">
                <div className="col-span-4 lg:col-span-2 flex px-5 sm:px-0 justify-center items-center">
                  <div className="w-1/2">
                    <h3 className="text-2xl font-bold my-5">Quick links</h3>
                    <div className="flex flex-col gap-2 ">
                      <Link
                        href="/"
                        //  onClick={scrollToTop}
                        className="text-l"
                      >
                        {"> Home "}
                      </Link>
                      <Link
                        href="/about"
                        // onClick={scrollToTop}
                        className="text-l"
                      >
                        {"> About Us"}
                      </Link>
                      <p
                        className="text-l"
                        //  onClick={scrollToTop}
                      >
                        {"> Terms and Condition"}
                      </p>
                      <p
                        className="text-l"
                        // onClick={scrollToTop}
                      >
                        {"> Privacy policy"}
                      </p>
                      <Link
                        href="/contact"
                        // onClick={scrollToTop}
                        className="text-l"
                      >
                        {"> Contact Us"}
                      </Link>
                    </div>
                  </div>
                  {/* <div
                    style={{
                      width: "50px",
                      height: "90%",
                      borderLeft: "1px solid #7a7979",
                    }}
                    className="hidden sm:block"
                  ></div> */}
                </div>
                <div
                  className="col-span-4 lg:col-span-2 md:col-span-3 m-[20px] flex flex-col gap-[20px] pl-[30px]"
                  style={{ borderLeft: "1px solid #7a7979" }}
                >
                  <div>
                    <h3 className="p-y-[20px] text-2xl font-bold text-center lg:text-start">Our Teams</h3>
                  </div>
                  <div className="grid grid-cols-6">
                    <div className="col-span-2 flex flex-col gap-[20px]">
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        (() => {
                          const member = members.find(
                            (e) => String(e.designation) === "Editor-in-Chief"
                          );
                          if (member) {
                            return (
                              <div key={member.id} className="flex flex-col">
                                <h4>{member.designation}</h4>
                                <h5 className="font-bold">{member.name}</h5>
                              </div>
                            );
                          }
                          return null; // Return null if no member is found
                        })()
                      )}
                    </div>

                    <div className="col-span-2 flex flex-col gap-[20px]">
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        (() => {
                          const member = members.find(
                            (e) => String(e.designation) === "Managing Director"
                          );
                          if (member) {
                            return (
                              <div key={member.id} className="flex flex-col">
                                <h4>{member.designation}</h4>
                                <h5 className="font-bold">{member.name}</h5>
                              </div>
                            );
                          }
                          return null;
                        })()
                      )}
                    </div>
                    {/* <div className="col-span-1 flex flex-col gap-[20px]"></div> */}
                    <div className="col-span-2 flex flex-col gap-[20px]">
                      <div className="flex h-full items-end">
                        <Link
                          href="/member"
                          //  onClick={scrollToTop}
                        >
                          <button
                            style={{
                              border: "2px solid green",
                              borderRadius: "20px",
                              padding: "3px 10px",
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                            className="hover:bg-green-100"
                          >
                            <span
                              className="text-l font-bold"
                              style={{ color: "green" }}
                            >
                              View All{" "}
                            </span>
                            <ion-icon
                              name="arrow-forward-outline"
                              style={{ color: "green" }}
                            ></ion-icon>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row-span-1 flex items-center justify-center width-100"
              style={{ height: "50%" }}
            >
              <div
                style={{
                  width: "90%",
                  borderRadius: "10px",
                  background: "linear-gradient(to top, #006400, #ffffff)",
                  height: "auto",
                }}
                className="grid lg:grid-cols-3 md:grid-cols-4 lg:py-2 md:py-3"
              >
                <div className="lg:col-span-1 md:col-span-3 flex py-5 pb-[100px] lg:pb-0 justify-center items-center">
                  <h3 className="text-3xl font-bold font-mukta text-[#2d5e29]">
                    For Advertisement
                  </h3>
                </div>
                <div
                  className="lg:col-span-1 md:col-span-2 px-3 flex items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-mukta flex flex-col gap-[20px] border-hidden lg:border-l lg:border-solid lg:border-white"
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="flex flex-col gap-[5px]">
                      <p
                        className="text-white text-lg lg:text-xl cursor-pointer"
                        onClick={() => handlePhoneClick("9855034935")}
                      >
                        Mobile No. +977 9855034935
                      </p>
                      <div className="text-white text-sm lg:text-xl flex flex-col lg:flex-row gap-[5px]">
                        <a
                          className="text-l"
                          href="mailto:info.krishisanjal@gmail.com"
                        >
                          info.krishisanjal@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="lg:col-span-1 md:col-span-2 flex items-center py-9"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-mukta flex flex-col gap-[20px]"
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="flex h-full flex-col gap-[5px]">
                      <p
                        className="text-white text-lg lg:text-xl cursor-pointer"
                        onClick={() => handlePhoneClick("9855034935")}
                      >
                        Mobile No. +977 9855034935
                      </p>
                      <p className="text-white text-sm lg:text-xl flex flex-col lg:flex-row">
                        <a
                          className="text-l"
                          href="mailto:info.krishisanjal@gmail.com"
                        >
                          info.krishisanjal@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "70px",
          width: "100%",
          marginTop: "50px",
          backgroundColor: themeColor,
        }}
        className={`flex flex-wrap justify-center items-center gap-2 px-2 sm:px-0`}
      >
        <p className="text-l" style={{ color: "white" }}>
          Copyright © 2024 KRISHI SANJAL
        </p>
        <p className="text-l" style={{ color: "white" }}>
          |
        </p>
        <a
          href="https://tachyonwave.com/"
          target="_blank"
          style={{ textDecoration: "none" }}
          className="text-white text-l"
        >
          Developed by Tachyonwave
        </a>
      </div>
    </div>
  );
};

export default MyFooter;
