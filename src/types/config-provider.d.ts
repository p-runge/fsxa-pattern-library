import { FSXAConfiguration } from "./store";

export interface ConfigProviderProps {
  config?: FSXAConfiguration;
  sections?: {
    [key: string]: any;
  };
  layouts?: {
    [key: string]: any;
  };
  debugMode?: boolean;
  editMode?: boolean;
}
