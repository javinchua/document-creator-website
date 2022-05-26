import React, { FunctionComponent } from "react";
import { Dropdown, Button } from "@govtechsg/tradetrust-ui-components";
const itemsList = [
  {
    name: "item1.tt",
  },
  {
    name: "macdonaldsProduct.tt",
  },
];
interface DropdownItemLabelProps {
  network: any;
}
const DropdownItemLabel: FunctionComponent<DropdownItemLabelProps> = ({ network }) => {
  return (
    <div className="flex items-center" data-testid={`network-select-dropdown-label-`}>
      {/* <img className="mr-2 w-5 h-5 rounded-full" src={network.image} alt={network.name} /> */}
      <span className="w-full">{network.name}</span>
      {/* <span className="m-1 p-1 bg-forest-500 rounded-lg justify-self-end" /> */}
    </div>
  );
};

export const FileLister: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-start p-3">
      <h2>Choose an existing config</h2>
      <div className="flex flex-row text-sm" style={{ minWidth: "12.5em" }}>
        <span className="mr-3 my-auto text-lg">Select your config file:</span>
        <Dropdown
          className="rounded-md py-1 pl-4 p-2 border border-gray-300 bg-white w-[173px]"
          data-testid="network-selector"
          dropdownButtonText={<DropdownItemLabel network={itemsList[0]} />}
        >
          <div className="w-[173px]">
            <span className="text-cloud-500 p-3 pr-8 cursor-default">Select a File</span>
            {itemsList.map((item, idx) => (
              <div className="flex items-center px-3 p-1" key={idx} data-testid={`network-select-dropdown-label-`}>
                {/* <img className="mr-2 w-5 h-5 rounded-full" src={item.image} alt={item.name} /> */}
                <span className="w-full">{item.name}</span>
                {/* <span className="m-1 p-1 bg-green-500 rounded-lg justify-self-end" /> */}
              </div>
            ))}
          </div>
        </Dropdown>
      </div>
      <div className="mt-4 mx-auto">
        <Button className="block mx-auto mb-5 text-cerulean border-gray-300 bg-white hover:bg-gray-50">
          Create Doc
        </Button>
      </div>
    </div>
  );
};
