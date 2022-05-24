import { FunctionComponent, useState } from "react";
import { FormControl } from "@material-ui/core";
import { NewField } from "./NewField";
import { Button } from "@govtechsg/tradetrust-ui-components";

export interface IField {
  fieldType: string;
  fieldName: string;
}
export interface Props {
  handlerJson: (json: any) => void;
  next: () => void;
}
export const ConfigTemplateCreator: FunctionComponent<Props> = ({ handlerJson, next }) => {
  const [fields, setFields] = useState<IField[]>([{} as IField]);
  const addField = () => {
    setFields((prevState: IField[]) => {
      return [...prevState, {} as IField];
    });
  };

  const handleFieldType = (index: number, type: string) => {
    setFields((prevState: IField[]) => {
      prevState[index].fieldType = type;
      return prevState;
    });
  };

  const handleFieldName = (index: number, name: string) => {
    setFields((prevState: IField[]) => {
      prevState[index].fieldName = name;
      return prevState;
    });
  };
  const turnToJson = () => {
    const array = [];
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i].fieldName;
      const temp = {
        title: name,
        type: fields[i].fieldType,
      };
      array.push(temp);
    }
    const object = array.reduce((obj, item) => {
      return {
        ...obj,
        [item["title"]]: item,
      };
    }, {});
    const defaultObject = array.reduce((obj, item) => {
      return {
        ...obj,
        [item["title"]]: item["title"],
      };
    }, {});
    const updatedObject = {
      network: "maticmum",
      wallet: {
        type: "ENCRYPTED_JSON",
      },
      forms: [
        {
          name: "Bill of landing",
          type: "TRANSFERABLE_RECORD",
          defaults: {
            $template: {
              type: "EMBEDDED_RENDERER",
              name: "BILL_OF_LADING_GENERIC",
              url: "https://generic-templates.tradetrust.io",
            },
            issuers: [
              {
                identityProof: {
                  type: "DNS-TXT",
                  location: "<Issuer's domain>",
                },
                name: "DEMO TOKEN REGISTRY",
                tokenRegistry: "<Your token registry>",
              },
            ],
            ...defaultObject,
          },
          schema: {
            type: "object",
            required: ["blNumber"],
            properties: {
              blNumber: {
                type: "string",
                title: "BL Number",
              },
              logo: {
                title: "Logo",
                type: "string",
              },
              companyName: {
                title: "Company Name",
                type: "string",
              },
              ...object,
            },
          },
        },
      ],
    };
    handlerJson(updatedObject);
    next();
  };
  return (
    <div className="flex flex-col items-center w-full p-3 mx-auto text-center">
      <h2 className="underline">Step 3</h2>
      <h2 className="italic">Fill in your form details</h2>
      <div className="w-4/5 mb-4">
        <FormControl fullWidth>
          {fields.map((field, index) => {
            return (
              <NewField
                key={index}
                field={fields[index]}
                handleFieldType={handleFieldType}
                handleFieldName={handleFieldName}
                index={index}
              />
            );
          })}
        </FormControl>
      </div>
      <div className="underline cursor-pointer text-[#4BC3E9]" onClick={addField}>
        Add new field
      </div>
      <Button
        className="block mx-auto mt-4 mb-5 w-36 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
        onClick={() => turnToJson()}
      >
        Submit
      </Button>
    </div>
  );
};
