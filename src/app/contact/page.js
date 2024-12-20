"use client";
import React, { useState } from "react";
import { useTheme } from "../Components/Context/ThemeContext";
import { Post } from "../Components/Redux/API";
import { message } from "antd/es";
import { usePathname } from "next/navigation";

const ContactUs = () => {
  const [errorMsg, setErrorMsg] = useState({ msg: "", position: "" });
  const pathname = usePathname();
  const { bgColor } = useTheme();
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone_no: "",
    message: "",
    address: "",
    language: pathname.includes("/en") ? "en" : "np",
  });

  const isValidEmail = (email) => {
    // Basic email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const submitBtnClk = async (e) => {
    e.preventDefault();
    if (contactData.name.length < 2) {
      setErrorMsg({
        msg: "Name must be at least 2 characters",
        position: "name",
      });
    } else if (contactData.address.length < 2) {
      setErrorMsg({
        msg: "Address must be at least 2 characters",
        position: "address",
      });
    } else if (contactData.email.length < 4) {
      setErrorMsg({
        msg: "Email must be at least 4 characters",
        position: "email",
      });
    } else if (!isValidEmail(contactData.email)) {
      setErrorMsg({
        msg: "Please enter a valid email address",
        position: "email",
      });
    } else if (contactData.phone_no.length !== 10) {
      setErrorMsg({ msg: "Phone must be 10 characters", position: "phone" });
    } else if (contactData.message.length < 5) {
      setErrorMsg({
        msg: "Message must be at least 5 characters",
        position: "message",
      });
    } else if (contactData.message.length > 150) {
      setErrorMsg({
        msg: "Message must be lesser than 150 characters",
        position: "message",
      });
    } else {
      // PostContact(contactData);
      try {
        const response = await Post({
          url: "/contact/contact",
          data: contactData,
        });
        message.success("Message send successfull");
        setContactData({
          name: "",
          email: "",
          phone_no: "",
          message: "",
          address: "",
          language: pathname.includes("/en") ? "en" : "np",
        });
        setErrorMsg({
          msg: "",
          position: "",
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-[80vh] w-[97%] sm:w-[90%]">
        <div className="md:h-[70px] h-[60px] border-b m-auto !mt-8 flex items-center justify-center text-white text-lg md:text-2xl w-[95%] bg-[#185924]">
          <p className="border-b border-[#AFAEAE] px-2">Contact</p>
        </div>
        <div className="lg:w-[90%] md:w-full m-auto flex !my-14 justify-center items-center flex-col-reverse md:flex-row">
          <div className="md:w-1/2 w-full flex justify-end">
            <div className="md:min-h-[350px] min-h-[300px] flex flex-col md:gap-5 mt-4 md:mt-0 gap-2 md:w-[80%] w-[95%]">
              <div className="flex flex-col gap-1 tracking-wide">
                <h3 className="text-[#185924] text-xl font-semibold">
                  Location:
                </h3>
                <div>
                  <p>
                    Institute of Technical Consultancy and Research Services
                    Pvt. Ltd. ( ITCRS){" "}
                  </p>
                  <p>Manmaiju, Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 tracking-wide">
                <h3 className="text-[#185924] text-xl font-semibold">
                  Phone no. :
                </h3>
                <p>+977-9855034935</p>
              </div>
              <div className="flex flex-col gap-1 tracking-wide">
                <h3 className="text-[#185924] text-xl font-semibold">
                  Email :
                </h3>
                <p>info@krishisanjal.com</p>
              </div>
              <div className="flex flex-col gap-1 tracking-wide">
                <h3 className="text-[#185924] text-xl font-semibold">
                  Information Department Registration No :
                </h3>
                <p>४२४६-२०८०/८१</p>
              </div>
            </div>
          </div>
          <div className="w-[1px] hidden md:block min-h-[380px] h-full bg-[#797979] mb-14"></div>
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <form className="md:w-[85%] w-[90%] m-auto mr-10 flex justify-center items-center flex-col gap-3">
              <input
                type="text"
                id="name"
                className="w-full border outline-none p-2"
                placeholder="Name *"
                value={contactData.name}
                name="name"
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              {errorMsg.position === "name" && (
                <p className="text-xs text-start !-mt-3.5 text-red-700 w-full ml-2">
                  {errorMsg.msg}
                </p>
              )}
              <input
                type="text"
                id="address"
                className="w-full border outline-none p-2"
                placeholder="Address *"
                value={contactData.address}
                name="address"
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              {errorMsg.position === "address" && (
                <p className="text-xs text-start !-mt-3.5 text-red-700 w-full ml-2">
                  {errorMsg.msg}
                </p>
              )}
              <input
                type="email"
                id="email"
                className="w-full border outline-none p-2"
                placeholder="Email *"
                value={contactData.email}
                name="email"
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              {errorMsg.position === "email" && (
                <p className="text-xs text-start !-mt-3.5 text-red-700 w-full ml-2">
                  {errorMsg.msg}
                </p>
              )}
              <input
                type="number"
                id="phone_no"
                className="w-full border outline-none p-2"
                placeholder="Phone Number *"
                value={contactData.phone_no}
                name="phone_no"
                onChange={(e) => {
                  if (
                    e.target.value.length <= 10 ||
                    e.nativeEvent.inputType === "deleteContentBackward"
                  ) {
                    setContactData({
                      ...contactData,
                      [e.target.name]: e.target.value,
                    });
                  }
                }}
              />

              {errorMsg.position === "phone" && (
                <p className="text-xs text-start !-mt-3.5 text-red-700 w-full ml-2">
                  {errorMsg.msg}
                </p>
              )}
              <textarea
                id="message"
                placeholder="Message *"
                className="resize-none border outline-none h-[125px] p-2 w-full"
                value={contactData.message}
                name="message"
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></textarea>
              {errorMsg.position === "message" && (
                <p className="text-xs text-start !-mt-3.5 text-red-700 w-full ml-2">
                  {errorMsg.msg}
                </p>
              )}
              <div className="w-full flex justify-end">
                <button
                  className="border px-5 shadow-lg rounded-sm !py-[7px] bg-[#185924] hover:bg-green-400 text-white duration-150"
                  onClick={submitBtnClk}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
