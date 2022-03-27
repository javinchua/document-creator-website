import { TextField } from "@material-ui/core";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ConfigTemplateCreator = () => {
  const handleSubmit = () => {
    return "hello";
  };
  return (
    <div className="flex flex-col p-3 text-center">
      <div className="p-3">
        <h2>Step 3: Fill in your form details</h2>
        <a
          onClick={(e) => e.stopPropagation()}
          className="text-cerulean-200 font-bold mt-8"
          href="https://docs.tradetrust.io/docs/document-creator/config-file/config-generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Refer to link for the template.
        </a>
        <form onSubmit={handleSubmit}>
          <TextField
            id="filled-full-width"
            label="Network:"
            placeholder="Network:"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="filled"
            multiline
            // value={details}
            // onChange={handleChangeDetails}
          />
        </form>
      </div>
    </div>
  );
};
