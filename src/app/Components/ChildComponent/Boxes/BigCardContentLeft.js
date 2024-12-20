import React from "react";

const BigCardContentLeft = ({ showParagraph = false }) => {
  return (
    <div
      className=" group cursor-pointer w-[100%] h-[100%] overflow-hidden font-mukta"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <div
        className="h-1/3 flex items-center justify-center "
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        {showParagraph && (
          <p
            className="text-l sm:text-3xl text-white text-base text-left line-clamp-3 !font-normal w-[80%] pt-3"
            style={{
              fontWeight: "900",
              lineHeight:'1.5'
            }}
          >
            नेपाल सरकारले आज नयाँ नीति घोषणा गर्दै आर्थिक सुधार र प्रशासनिक
            सुधारको लागि विशेष योजना नेपाल सरकारले आज नयाँ नीति घोषणा गर्दै
            आर्थिक सुधार र प्रशासनिक सुधारको लागि विशेष योजना नेपाल सरकारले आज
            नयाँ नीति घोषणा गर्दै आर्थिक सुधार र प्रशासनिक सुधारको लागि
          </p>
        )}
      </div>
    </div>
  );
};

export default BigCardContentLeft;
