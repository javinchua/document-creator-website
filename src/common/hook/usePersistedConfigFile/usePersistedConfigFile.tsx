import createPersistedState from "use-persisted-state";
import { ConfigFile } from "../../../types";

const useConfigFile = createPersistedState<ConfigFile>("CONFIG_FILE");

export const usePersistedConfigFile = (): {
  configFile?: ConfigFile;
  setConfigFile: (configFile?: ConfigFile) => void;
} => {
  const [configFileFromStorage, setConfigFileInStorage] = useConfigFile();
  const configFile = Object.keys(configFileFromStorage as ConfigFile).length === 0 ? undefined : configFileFromStorage;
  const setConfigFile = (config?: ConfigFile): void => {
    setConfigFileInStorage(config);
  };
  return { configFile, setConfigFile };
};
