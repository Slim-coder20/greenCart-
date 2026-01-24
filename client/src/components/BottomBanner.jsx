import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      <img
        src={assets.bottom_banner_image}
        alt="bottom_banner_image"
        className="w-full hidden md:block"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="bottom_banner_image"
        className="w-full md:hidden"
      />
      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-8 pb-4 md:pt-0 md:pb-0 md:pr-12 lg:pr-24 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-4 md:mb-8 text-center md:text-right">
          Why We Are the Best?
        </h1>
        <div className="flex flex-col gap-3 md:gap-5 w-full md:w-auto max-w-xs md:max-w-none">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 md:gap-4">
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-9 h-9 md:w-11 md:h-11 flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-base text-gray-500/70 break-words">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
