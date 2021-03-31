import {
  FSXAConfiguration,
  GCAPage,
  LogLevel,
  NavigationData,
} from "fsxa-api/dist/types";

export declare type FSXAModuleParams =
  | {
      mode: "proxy";
      logLevel?: LogLevel;
      baseUrl: {
        client: string;
        server: string;
      };
    }
  | {
      logLevel?: LogLevel;
      mode: "remote";
      config: FSXAConfiguration;
    };
export interface FSXAAppError {
  message: string;
  description?: string;
  stacktrace?: string;
}
export enum FSXAAppState {
  not_initialized = "not_initialized",
  initializing = "initializing",
  ready = "ready",
  error = "error",
}
export interface FSXAVuexState {
  locale: string | null;
  configuration: FSXAModuleParams;
  appState: FSXAAppState;
  navigation: Record<string, NavigationData>;
  settings: Record<string, GCAPage | null>;
  error: FSXAAppError | null;
  stored: Record<
    string,
    Record<
      string,
      {
        ttl: number;
        fetchedAt: number;
        value: any;
      }
    >
  >;
  mode: "release" | "preview";
}
export interface RootState {
  fsxa: FSXAVuexState;
}
