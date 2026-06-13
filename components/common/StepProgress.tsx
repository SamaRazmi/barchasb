import React from "react";

interface StepProgressProps {
  currentStep: number;
  steps?: number;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  steps = 5,
}) => {
  return (
    <div className="flex justify-center w-full mt-[2vh]">
      <div className="flex items-center w-[90%]">
        {Array.from({ length: steps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              {/* خط قبل از دایره */}
              {index !== 0 && (
                <div
                  className={`flex-1 h-1 ${
                    isCompleted || isActive ? "bg-[#143A62]" : "bg-gray-300"
                  }`}
                ></div>
              )}

              {/* دایره */}
              <div
                className={`flex-shrink-0 relative rounded-full border-2 flex flex-col items-center justify-center 
                  ${
                    isActive || isCompleted
                      ? "bg-[#143A62] border-[#143A62]"
                      : "bg-white border-gray-300"
                  }
                  w-[5vh] h-[5vh] sm:w-[8vh] sm:h-[8vh] md:w-[9vh] md:h-[9vh] lg:w-[10vh] lg:h-[10vh]`}
              >
                {/* متن داخل دایره */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span
                    className={`text-[1.6vh] sm:text-[2vh] leading-[1] ${
                      isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-500"
                          : "text-[#143A62]"
                    }`}
                  >
                    قدم
                  </span>
                  <span
                    className={`font-bold text-[1.6vh] sm:text-[2vh] ${
                      isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-500"
                          : "text-[#143A62]"
                    }`}
                  >
                    {stepNumber}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
