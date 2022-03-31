import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { readFileAsJson } from "../../../../../common/utils";
import { getLogger } from "../../../../../utils/logger";
import { ContentFrame } from "../../../../UI/ContentFrame";
import { StyledDropZone } from "../../../../UI/StyledDropZone";
import { Wallet } from "ethers";

const { stack } = getLogger("ConfigFileDropZone");
interface WalletFileDropZone {
  errorMessage?: string;
  onWalletFile: (walletFile: Wallet) => void;
}
export const WalletFileDropZone: FunctionComponent<WalletFileDropZone> = ({ onWalletFile, errorMessage }) => {
  const [fileErrors, setFileErrors] = useState<Error[]>();

  useEffect(() => {
    if (errorMessage) {
      const malformedError = new Error(errorMessage);
      setFileErrors([malformedError]);
    } else {
      setFileErrors(undefined);
    }
  }, [errorMessage]);

  const onDropAccepted = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<Wallet>(file);
      setFileErrors(undefined);
      onWalletFile(config);
    } catch (e) {
      if (e instanceof Error) {
        const readFileError = new Error("Document cannot be read. Please check that you have a valid document");
        setFileErrors([readFileError]);
        stack(e);
      }
    }
  };

  const defaultStyle = "bg-white";
  const activeStyle = "border-green-400 bg-green-50";
  const acceptStyle = "border-green-700 bg-green-70";
  const dropzoneOptions = {
    onDropAccepted,
    maxFiles: 1,
  };

  return (
    <>
      <h2 data-testid="config-dropzone-title" className="mb-8">
        Step 2: Upload your wallet.json file
      </h2>
      <ContentFrame>
        <StyledDropZone
          dropzoneOptions={dropzoneOptions}
          defaultStyle={defaultStyle}
          activeStyle={activeStyle}
          acceptStyle={acceptStyle}
          fileErrors={fileErrors}
          dropzoneIcon={"/dropzone-graphic.png"}
          dataTestId="config-file-dropzone"
        >
          <h4 data-testid="home-description">Drag and drop your wallet configuration file here</h4>
          <p className="my-4">or</p>
          <Button className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 block mx-auto mb-5">
            Select Document
          </Button>
        </StyledDropZone>
      </ContentFrame>
    </>
  );
};
