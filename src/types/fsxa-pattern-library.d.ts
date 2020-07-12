import { Module } from "vuex";
import { FSXAConfiguration } from "fsxa-api";
import { RootState, FSXAVuexState } from "./../store";
import { AxiosStatic } from "axios";

export function getFSXAModule<R extends RootState>(
  configuration: FSXAConfiguration,
  axiosToUse?: AxiosStatic,
): Module<FSXAVuexState, R>;

export {
  FSXAActions,
  FSXAGetters,
  RootState,
  FSXAAppError,
  FSXAAppState,
  FSXAVuexState,
} from "./../store";
export * from "./components";
export * from "./../constants";
