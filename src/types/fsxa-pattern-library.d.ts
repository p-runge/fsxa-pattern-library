import { Module } from "vuex";
import { FSXAContentMode } from "fsxa-api";
import { RootState, FSXAVuexState, FSXAModuleParams } from "./../store";

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAModuleParams,
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
