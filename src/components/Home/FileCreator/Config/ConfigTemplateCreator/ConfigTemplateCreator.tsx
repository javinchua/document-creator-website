import { FunctionComponent, useState } from "react";
import { FormControl } from "@material-ui/core";
import { NewField } from "./NewField";
import { Button } from "@govtechsg/tradetrust-ui-components";

export interface IField {
  fieldType: string;
  fieldName: string;
}

export const ConfigTemplateCreator: FunctionComponent = () => {
  const [fields, setFields] = useState<IField[]>([{ fieldType: "string", fieldName: "name" }]);
  const addField = () => {
    setFields((prevState: IField[]) => {
      if (prevState) {
        return [...prevState, {} as IField];
      }
      return [{} as IField];
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

  return (
    <div className="flex flex-col items-center w-1/2 p-3 mx-auto text-center">
      <h2>Step 3: Fill in your form details</h2>
      <div className="w-3/4 mb-4">
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
      <div className="underline cursor-pointer text-cerulean" onClick={addField}>
        Add new field
      </div>
      <Button className="block mx-auto mt-4 mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500">
        Submit
      </Button>
    </div>
  );
};
