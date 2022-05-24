import React from "react";

interface ContentFrameProps {
  children: React.ReactNode;
}

export const ContentFrame: React.FunctionComponent<ContentFrameProps> = ({ children }: ContentFrameProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex-1 max-w-screen-md">{children}</div>
      <div className="hidden lg:block ml-8 my-auto">
        <img src={"/creator-graphic.png"} className="w-32 " />
      </div>
    </div>
  );
};
