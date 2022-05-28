import React, { FunctionComponent } from "react";
import { Button } from "@govtechsg/tradetrust-ui-components";
import logo from "./logo-qrcode.png";
const itemsList = [
  {
    name: "item1.tt",
    selected: false,
  },
  {
    name: "macs.tt",
    selected: true,
  },
  {
    name: "kfcProduct.tt",
    selected: false,
  },
  {
    name: "product2.tt",
    selected: false,
  },
];

export const FileLister: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-start p-3">
      <h2>Choose an existing config</h2>
      <div className="flex flex-col text-sm" style={{ minWidth: "12.5em" }}>
        <div className="grid grid-cols-3 gap-2 w-full">
          {itemsList.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-row items-center border border-black rounded-lg p-2 cursor-pointer ${
                item.selected && "bg-blue-400"
              }`}
            >
              <img src={logo} alt="logo" />
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 mx-auto">
        <Button className="block mx-auto mb-5 text-cerulean border-gray-300 bg-white hover:bg-gray-50">
          Create Doc
        </Button>
      </div>
    </div>
  );
};
