export interface FSXAConfiguration {
  caas: string;
  navigationService: string;
  apiKey: string;
  locale: string;
}

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
