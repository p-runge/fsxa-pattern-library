import { Module } from "vuex";
import { RootState, FSXAVuexState } from "./store";
import FSXAApi from "fsxa-api";

export function getFSXAModule<R extends RootState>(
  fsxaAPI?: FSXAApi,
): Module<FSXAVuexState, R>;

export { FSXAActions, FSXAGetters } from "./../store";
export { default as FSXAApi } from "fsxa-api";
export * from "./components";
export * from "./store";
export * from "./../constants";
