"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthors } from "../../Context/AuthorContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

const AuthorBredCrumb = ({
  textBlack = true,
  id,
  category,
  nepaliDate,
  englishDate,
  language,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { authors, loading } = useAuthors();
  const lge = pathname.includes("/en") ? "en" : "np";

  const myAuthor = useMemo(() => {
    return authors.find((author) => author.id === Number(id));
  }, [authors, id]);

  const handleAuthorClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(lge === "en" ? `/en/author/${id}` : `/author/${id}`);
  };

  const textColorClass = textBlack ? "text-black/80" : "text-white/80";
  const dividerColorClass = textBlack ? "bg-black/80" : "bg-white/80";

  return (
    <div className="flex justify-center items-center gap-3">
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={handleAuthorClick}
      >
        <div className="flex items-center justify-center">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
            <Image
              src={
                myAuthor?.image ||
                "https://media.istockphoto.com/id/827247322/vector/danger-sign-vector-icon-attention-caution-illustration-business-concept-simple-flat-pictogram.jpg?s=612x612&w=0&k=20&c=BvyScQEVAM94DrdKVybDKc_s0FBxgYbu-Iv6u7yddbs="
              }
              width={35}
              height={35}
              className="object-cover w-full h-full"
              alt={myAuthor?.name || "Author"}
              onError={(e) => {
                e.target.src =
                  "https://media.istockphoto.com/id/827247322/vector/danger-sign-vector-icon-attention-caution-illustration-business-concept-simple-flat-pictogram.jpg?s=612x612&w=0&k=20&c=BvyScQEVAM94DrdKVybDKc_s0FBxgYbu-Iv6u7yddbs=";
              }}
            />
          </div>
        </div>

        <div
          className={`font-mukta text-[19px] font-bold hover:text-[#101a9c] ${textColorClass}`}
        >
          {loading ? "Loading..." : myAuthor?.name || "Author Not Found"}
        </div>
      </div>
      <div className={`font-mukta h-[20px] w-[1px] ${dividerColorClass}`}></div>
      <div className={`font-mukta ${textColorClass}`}>
        {language === "en" ? englishDate : nepaliDate}
      </div>
      <div className={`font-mukta h-[20px] w-[1px] ${dividerColorClass}`}></div>
      <div className={`font-mukta ${textColorClass}`}>{category}</div>
    </div>
  );
};

export default AuthorBredCrumb;
