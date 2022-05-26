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
// import Grow from "@material-ui/core/Grow";
import { FundWallet } from "./FileCreator/FundWallet";
import { Signer } from "ethers";
import { ProgressBar } from "@govtechsg/tradetrust-ui-components";
import { FileLister } from "./FileLister";

export const HomeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { configFile } = usePersistedConfigFile();
  const [jsonConfig, setJsonConfig] = useState<Record<string, unknown>>();
  const [stage, setStage] = useState<number>(5);
  const [signer, setSigner] = useState<Signer>();

  const handlerJson = (object: Record<string, unknown>) => {
    setJsonConfig(object);
  };
  const toNextStage = () => {
    setStage(stage + 1);
  };

  const stages = [
    <WalletConfigCreator key={0} next={toNextStage} setSigner={setSigner} />,
    <FundWallet key={1} next={toNextStage} signer={signer} />,
    <ConfigTemplateCreator handlerJson={handlerJson} key={2} next={toNextStage} />,
    <ConfigFileCreator jsonConfig={jsonConfig} key={3} next={toNextStage} signer={signer} />,
    <ConfigFileDropZoneContainer key={4} />,
  ];
  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms-selection" />;

  return configFile ? (
    <WalletDecryptionContainer />
  ) : (
    <>
      {stage === 5 ? (
        <div className="max-w-xl p-4 border font-normal rounded-xl bg-white shadow-xl transition-colors duration-200 hover:bg-gray-50 mx-auto">
          <FileLister />
        </div>
      ) : (
        <>
          <div className="max-w-xl mx-auto">
            <ProgressBar step={stage + 1} totalSteps={stages.length} />
          </div>
          <div className="max-w-xl p-4 border font-normal rounded-xl bg-white shadow-xl transition-colors duration-200 hover:bg-gray-50 mx-auto">
            {stages[stage]}
          </div>
        </>
      )}
    </>
  );
};
