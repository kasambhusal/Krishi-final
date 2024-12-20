"use client";
import React, { useEffect, useState } from "react";
import { Get } from "../Redux/API";
import { useTheme } from "../Context/ThemeContext";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bgColor } = useTheme();
  useEffect(() => {
    const scrollToTop = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Smooth scrolling
        });
      }
    };
    scrollToTop();
  }, []);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await Get({ url: "/public/member/get-members" });
        const filteredResponse = response.sort(
          (a, b) => a.display_order - b.display_order
        );
        setMembers(filteredResponse);
      } catch (error) {
        console.error("Error fetching members: " + error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const advisors = members.filter((member) => member.designation === "Advisor");
  const otherMembers = members.filter(
    (member) => member.designation !== "Advisor"
  );

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-[97%] sm:w-[90%] my-3 py-5 px-4 flex flex-wrap gap-[10px] sm:gap-[30px] justify-evenly">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <p className="text-xl font-bold">Loading Members...</p>
          </div>
        ) : (
          <>
            {advisors.length > 0 && (
              <div className="w-full my-5">
                <h2 className="text-3xl font-semibold text-center mb-3">
                  Advisors
                </h2>
                <div className="flex flex-wrap gap-[10px] justify-center">
                  {advisors.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden my-3 transition-transform transform hover:scale-105"
                      style={{
                        width: "200px", // Increased width
                        maxWidth: "300px",
                      }}
                    >
                      <div
                        className="w-full h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${member.image})`,
                        }}
                      >
                        <a
                          href={member.social_media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-end items-end h-full p-2"
                        >
                          <ion-icon
                            name="logo-facebook"
                            size="large"
                            style={{
                              color: "#2c633b",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              padding: "5px",
                            }}
                          ></ion-icon>
                        </a>
                      </div>
                      <div className="flex flex-col items-center p-3">
                        <h2 className="font-bold text-xl text-center font-mukta">
                          {member.name}
                        </h2>
                        <h3 className="font-mukta text-lg text-center text-gray-600">
                          {member.designation}
                        </h3>
                        {member.description && (
                          <p className="text-gray-500 text-center text-sm mt-2 px-2">
                            {member.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherMembers.length > 0 && (
              <div className="w-full my-5">
                <h2 className="text-3xl font-semibold text-center mb-3">
                  Team Members
                </h2>
                <div className="flex flex-wrap gap-[10px] justify-center">
                  {otherMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden my-3 transition-transform transform hover:scale-105"
                      style={{
                        width: "200px", // Increased width
                        maxWidth: "300px",
                      }}
                    >
                      <div
                        className="w-full h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${member.image})`,
                        }}
                      >
                        <a
                          href={member.social_media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-end items-end h-full p-2"
                        >
                          <ion-icon
                            name="logo-facebook"
                            size="large"
                            style={{
                              color: "#2c633b",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              padding: "5px",
                            }}
                          ></ion-icon>
                        </a>
                      </div>
                      <div className="flex flex-col items-center p-3">
                        <h2 className="font-bold text-xl text-center font-mukta">
                          {member.name}
                        </h2>
                        <h3 className="font-mukta text-lg text-center text-gray-600">
                          {member.designation}
                        </h3>
                        {member.description && (
                          <p className="text-gray-500 text-center text-sm mt-2 px-2">
                            {member.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
