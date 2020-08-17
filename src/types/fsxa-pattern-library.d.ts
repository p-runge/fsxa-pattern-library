import { Module } from "vuex";
import { FSXAContentMode, FSXAApiParams } from "fsxa-api";
import { RootState, FSXAVuexState } from "./../store";

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAApiParams,
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
