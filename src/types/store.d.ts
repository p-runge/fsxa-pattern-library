import { FSXAConfiguration } from "fsxa-api";

export interface FSXAVuexState {
  configuration?: FSXAConfiguration;
  stored: {
    // eslint-disable-next-line
    [key: string]: any;
  };
}
export interface RootState {
  fsxa: FSXAVuexState;
}
