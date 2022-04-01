import { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZone";
import { WalletDecryptionContainer } from "./WalletDecryption/WalletDecryptionContainer";
import { WalletConfigCreator } from "./FileCreator/WalletConfigCreator";
import { ConfigFileCreator } from "./FileCreator/Config/ConfigFileCreator";
import { ConfigTemplateCreator } from "./FileCreator/Config/ConfigTemplateCreator";
import { useState } from "react";
import Grow from "@material-ui/core/Grow";
import { FundWallet } from "./FileCreator/FundWallet";

export const HomeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { configFile } = usePersistedConfigFile();
  const [jsonConfig, setJsonConfig] = useState<Record<string, unknown>>();
  const [stage, setStage] = useState<number>(0);

  const handlerJson = (object: Record<string, unknown>) => {
    setJsonConfig(object);
  };
  const toNextStage = () => {
    setStage(stage + 1);
  };

  const stages = [
    <WalletConfigCreator key={0} next={toNextStage} />,
    <FundWallet key={1} next={toNextStage} />,
    <ConfigTemplateCreator handlerJson={handlerJson} key={2} next={toNextStage} />,
    <ConfigFileCreator jsonConfig={jsonConfig} key={3} next={toNextStage} />,
    <ConfigFileDropZoneContainer key={4} />,
  ];
  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms-selection" />;

  return configFile ? (
    <WalletDecryptionContainer />
  ) : (
    <>
      {stages.map((display, index) => {
        return (
          <Grow in={stage == index} key={index}>
            <div>{display}</div>
          </Grow>
        );
      })}
    </>
  );
};
