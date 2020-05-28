import { NavigationProps } from "./navigation";
import { ConfigProviderProps } from "./config-provider";
import { Module } from "vuex";
import { RootState, FSXAVuexState } from "./store";
import * as tsx from "vue-tsx-support";
import FSXAApi from "fsxa-api";
import { PageProps, BaseSectionProps } from "./page";

export class FSXANavigation extends tsx.Component<NavigationProps> {}
export class FSXAConfigProvider extends tsx.Component<ConfigProviderProps> {}
export class FSXAPage extends tsx.Component<PageProps> {}
export class FSXABaseSection<Payload = {}> extends tsx.Component<
  BaseSectionProps<Payload>
> {
  payload: Payload;
}

export function getFSXAModule<R extends RootState>(
  fsxaAPI?: FSXAApi
): Module<FSXAVuexState, R>;
export { FSXAActions, FSXAGetters } from "./../store";
export { default as FSXAApi } from "fsxa-api";
export * from "./navigation";
export * from "./config-provider";
export * from "./store";
export * from "./../constants";
