import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZone";
import { WalletDecryptionContainer } from "./WalletDecryption/WalletDecryptionContainer";
import { WalletConfigCreator } from "./FileCreator/WalletConfigCreator";
import { ConfigFileCreator } from "./FileCreator/Config/ConfigFileCreator";
import { WalletFileDropZoneContainer } from "./FileCreator/Config/WalletFileDropZone/WalletFileDropZoneContainer";
import { ConfigTemplateCreator } from "./FileCreator/Config/ConfigTemplateCreator";
import { useState } from "react";
export const HomeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { configFile } = usePersistedConfigFile();
  const [jsonConfig, setJsonConfig] = useState<Record<string, unknown>>();
  const handlerJson = (object: Record<string, unknown>) => {
    setJsonConfig(object);
  };
  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms-selection" />;

  return configFile ? (
    <WalletDecryptionContainer />
  ) : (
    <>
      <WalletConfigCreator />
      <WalletFileDropZoneContainer />
      <ConfigTemplateCreator handlerJson={handlerJson} />
      <ConfigFileCreator jsonConfig={jsonConfig} /> <ConfigFileDropZoneContainer />
    </>
  );
};
