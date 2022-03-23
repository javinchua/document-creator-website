import React, { FunctionComponent, useState } from "react";
// import { assertConfigFile } from "../../../../../common/config/validate";
import { usePersistedWalletFile } from "../../../../../common/hook/usePersistedWalletFile";
// import { ConfigFile } from "../../../../../types";
import { Wallet } from "ethers";
import { Wrapper } from "../../../../UI/Wrapper";
import { WalletFileDropZone } from "./WalletFileDropZone";

export const WalletFileDropZoneContainer: FunctionComponent = () => {
  const [walletValidationError, setWalletValidationError] = useState("");
  const { setWalletFile } = usePersistedWalletFile();

  const onWalletFile = async (walletFileFromDropZone: Wallet): Promise<void> => {
    try {
      // assertWalletFile(walletFileFromDropZone);
      setWalletFile(walletFileFromDropZone);
      setWalletValidationError("");
    } catch (e) {
      if (e instanceof Error) {
        setWalletValidationError(`Config is malformed: ${e.message}`);
      }
    }
  };

  return (
    <Wrapper>
      <WalletFileDropZone errorMessage={walletValidationError} onWalletFile={onWalletFile} />
    </Wrapper>
  );
};
