import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { IField } from "./ConfigTemplateCreator";

interface INewFieldProps {
  field: IField;
  handleFieldName: (index: number, type: string) => void;
  handleFieldType: (index: number, name: string) => void;
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NewField = ({ field, handleFieldName, handleFieldType, index }: INewFieldProps): JSX.Element => {
  return (
    <div className="flex flex-row justify-between mt-4">
      <TextField
        value={field.fieldType}
        onChange={(e) => handleFieldType(index, e.target.value as string)}
        select // tell TextField to render select
        label="Field Type"
        id="outlined-basic"
        variant="outlined"
        style={{ width: "45%" }}
        className="border-2 border-black"
      >
        <MenuItem value={"string"}>String</MenuItem>
        <MenuItem value={"number"}>Number</MenuItem>
        <MenuItem value={"boolean"}>True/False</MenuItem>
      </TextField>
      <TextField
        label="Field Name"
        value={field.fieldName}
        variant="outlined"
        onChange={(e) => handleFieldName(index, e.target.value as string)}
        style={{ width: "45%" }}
      />
    </div>
  );
};
