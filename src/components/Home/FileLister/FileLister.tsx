import React, { FunctionComponent } from "react";
import { Button } from "@govtechsg/tradetrust-ui-components";
import logo from "./logo-qrcode.png";
const itemsList = [
  {
    name: "Exporia.tt",
    selected: false,
  },
  {
    name: "Econtrade.tt",
    selected: true,
  },
  {
    name: "Postshop.tt",
    selected: false,
  },
  {
    name: "Bilate.tt",
    selected: false,
  },
];

export const FileLister: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-start p-3">
      <h2>Choose an existing config</h2>
      <div className="w-full gap-2 mt-8" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {itemsList.map((item, idx) => (
          <div key={idx} className="flex justify-center w-full">
            <Button className="flex items-center w-11/12 mb-5 bg-white border-gray-300 text-cerulean hover:bg-gray-50">
              <img src={logo} alt="logo" className="w-10" />
              {item.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
