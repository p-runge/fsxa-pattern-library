import Vue from "vue";
import Vuex, { Module } from "vuex";
import {
  FSXAApi,
  NavigationData,
  FSXAApiParams,
  FSXAContentMode,
  GCAPage,
} from "fsxa-api";
import { determineCurrentRoute } from "@/utils/navigation";
import {
  FSXAAppError,
  FSXAAppState,
  FSXAModuleParams,
  FSXAVuexState,
  RootState,
} from "@/types/store";

Vue.use(Vuex);

const prefix = "fsxa";

const Actions = {
  setGlobalData: "setGlobalData",
  initializeApp: "initializeApp",
  hydrateClient: "hydrateClient",
  setStoredItem: "setStoredItem",
};

export const FSXAActions = {
  setGlobalData: `${prefix}/${Actions.setGlobalData}`,
  initializeApp: `${prefix}/${Actions.initializeApp}`,
  hydrateClient: `${prefix}/${Actions.hydrateClient}`,
  setStoredItem: `${prefix}/${Actions.setStoredItem}`,
};

export const getFSXAConfiguration = (
  config: FSXAModuleParams,
): FSXAApiParams => {
  if (config.mode === "remote") return config;
  return {
    mode: config.mode,
    baseUrl:
      typeof window !== "undefined"
        ? config.baseUrl.client
        : config.baseUrl.server,
  };
};

const GETTER_NAVIGATION_DATA = "navigationData";
const GETTER_CONFIGURATION = "configuration";
const GETTER_LOCALE = "locale";
const GETTER_ITEM = "item";
const GETTER_PAGE_BY_URL = "getPageIdByUrl";
const GETTER_MODE = "mode";
const GETTER_REFERENCE_URL = "getReferenceUrl";
const GETTER_SETTINGS = "settings";
const GETTER_APP_STATE = "appState";
const GETTER_APP_ERROR = "error";

export const FSXAGetters = {
  [GETTER_APP_STATE]: `${prefix}/${GETTER_APP_STATE}`,
  [GETTER_APP_ERROR]: `${prefix}/${GETTER_APP_ERROR}`,
  [GETTER_NAVIGATION_DATA]: `${prefix}/${GETTER_NAVIGATION_DATA}`,
  [GETTER_CONFIGURATION]: `${prefix}/${GETTER_CONFIGURATION}`,
  [GETTER_LOCALE]: `${prefix}/${GETTER_LOCALE}`,
  [GETTER_ITEM]: `${prefix}/${GETTER_ITEM}`,
  [GETTER_PAGE_BY_URL]: `${prefix}/${GETTER_PAGE_BY_URL}`,
  [GETTER_MODE]: `${prefix}/${GETTER_MODE}`,
  [GETTER_REFERENCE_URL]: `${prefix}/${GETTER_REFERENCE_URL}`,
  [GETTER_SETTINGS]: `${prefix}/${GETTER_SETTINGS}`,
};

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAModuleParams,
): Module<FSXAVuexState, R> {
  return {
    namespaced: true,
    state: () => ({
      stored: {},
      locale: null,
      navigation: {},
      settings: {},
      appState: FSXAAppState.not_initialized,
      error: null,
      mode,
      configuration: params,
    }),
    actions: {
      [Actions.setGlobalData]: async function(
        { commit },
        payload: {
          navigation: Record<string, NavigationData>;
          settings: Record<string, any>;
        },
      ) {
        commit("setGlobalData", payload);
      },
      [Actions.initializeApp]: async function(
        { commit },
        payload: {
          defaultLocale: string;
          initialPath?: string;
          availableLocales?: string[];
          forceRefresh?: boolean;
        },
      ) {
        const path = payload.initialPath
          ? decodeURI(payload.initialPath)
          : null;
        commit("setAppAsInitializing", payload.forceRefresh);
        try {
          const fsxaAPI = new FSXAApi(
            this.state.fsxa.mode as FSXAContentMode,
            getFSXAConfiguration(this.state.fsxa.configuration),
            this.state.fsxa.configuration.logLevel,
          );
          const navigation: Record<string, NavigationData> = {};
          const settings: Record<string, any> = {};
          if (payload.availableLocales) {
            // check if data is already set
            const [navigationData, settingsData] = await Promise.all([
              Promise.all(
                payload.availableLocales.map(locale =>
                  fsxaAPI.fetchNavigation(null, locale),
                ),
              ),
              Promise.all(
                payload.availableLocales.map(locale =>
                  fsxaAPI.fetchProjectProperties(locale),
                ),
              ),
            ]);
            payload.availableLocales.forEach((locale, index) => {
              settings[locale] = settingsData[index];
              navigation[locale] = navigationData[index]!;
            });
            settingsData.forEach(
              (localSettings, index) =>
                (settings[payload.availableLocales![index]] =
                  localSettings || null),
            );
            // we will get the current locale by the route
          } else {
            // we will only load the necessary language
            let navigationData = await fsxaAPI.fetchNavigation(
              path || null,
              payload.defaultLocale,
            );
            if (!navigationData && path !== null) {
              navigationData = await fsxaAPI.fetchNavigation(
                null,
                payload.defaultLocale,
              );
            }
            if (!navigationData) {
              commit("setError", {
                message:
                  "Could not fetch navigation-data from NavigationService",
                description:
                  "Please make sure that the Navigation-Service is available and your config is correct. See the documentation for more information.",
              });
              return;
            }
            const currentLocale = navigationData.meta.identifier.languageId;
            navigation[currentLocale] = navigationData;
            const settingsData = await fsxaAPI.fetchProjectProperties(
              currentLocale,
            );
            settings[currentLocale] = settingsData || null;
          }
          const currentRoute = determineCurrentRoute(
            navigation,
            path && path !== "/"
              ? path
              : navigation[payload.defaultLocale]?.pages.index,
          );
          if (!currentRoute) throw new Error("No current route could be found");
          commit("setAppAsInitialized", {
            locale: currentRoute.locale,
            navigation,
            settings,
          });
        } catch (error) {
          commit("setAppState", FSXAAppState.error);
          commit("setError", {
            message: error.message,
            stacktrace: error.stack,
          });
          return;
        }
      },
      [Actions.hydrateClient]: function({ commit }, payload: FSXAVuexState) {
        commit("setInitialStateFromServer", payload);
      },
      [Actions.setStoredItem]: async function({ commit }, payload) {
        commit("setStoredItem", payload);
      },
    },
    mutations: {
      setGlobalData(state, payload) {
        state.navigation = payload.navigation;
        state.settings = payload.settings;
      },
      setAppAsInitializing(state, forceRefresh = false) {
        state.appState = FSXAAppState.initializing;
        if (forceRefresh) {
          state.navigation = {};
          state.settings = {};
          state.stored = {};
        }
        state.error = null;
      },
      setAppAsInitialized(
        state,
        payload: {
          locale: string;
          navigation: Record<string, NavigationData>;
          settings: Record<string, GCAPage | null>;
        },
      ) {
        state.appState = FSXAAppState.ready;
        state.navigation = {
          ...state.navigation,
          ...payload.navigation,
        };
        state.settings = {
          ...state.settings,
          ...payload.settings,
        };
        state.locale = payload.locale;
      },
      setStoredItem(state, { key, value, fetchedAt, ttl }) {
        if (!state.locale) return;
        state.stored = {
          ...state.stored,
          [state.locale]: {
            ...state.stored[state.locale],
            [key]: {
              value,
              fetchedAt,
              ttl,
            },
          },
        };
      },
      setInitialStateFromServer(state, initialStateFromServer: FSXAVuexState) {
        Vue.set(state, "configuration", initialStateFromServer.configuration);
        Vue.set(state, "locale", initialStateFromServer.locale);
        Vue.set(state, "navigation", initialStateFromServer.navigation);
        Vue.set(state, "settings", initialStateFromServer.settings);
        Vue.set(state, "appState", initialStateFromServer.appState);
        Vue.set(state, "error", initialStateFromServer.error);
        Vue.set(state, "stored", initialStateFromServer.stored);
      },
      setAppState(state, appState) {
        Vue.set(state, "appState", appState);
      },
      setError(state, payload: FSXAAppError) {
        state.appState = FSXAAppState.error;
        state.error = payload;
      },
    },
    getters: {
      [GETTER_APP_STATE]: function(state): FSXAAppState {
        return state.appState;
      },
      [GETTER_APP_ERROR]: function(state) {
        return state.error;
      },
      [GETTER_NAVIGATION_DATA]: function(state) {
        return (
          (state.navigation &&
            state.locale &&
            state.navigation[state.locale]) ||
          null
        );
      },
      [GETTER_SETTINGS]: function(state) {
        return (
          (state.settings && state.locale && state.settings[state.locale]) ||
          null
        );
      },
      [GETTER_CONFIGURATION]: function(state) {
        return state.configuration || null;
      },
      [GETTER_LOCALE]: function(state) {
        return state.locale || null;
      },
      [GETTER_ITEM]: (state): any => (id: string) =>
        (state.locale &&
          state.stored[state.locale] &&
          state.stored[state.locale][id]) ||
        null,
      [GETTER_PAGE_BY_URL]: (state, getters) => (url: string) => {
        const navigationData = getters[FSXAGetters[GETTER_NAVIGATION_DATA]];
        if (!navigationData) return null;
        return (navigationData as NavigationData).seoRouteMap[url] || null;
      },
      [GETTER_MODE]: (state): FSXAContentMode => state.mode as FSXAContentMode,
      [GETTER_REFERENCE_URL]: state => (
        referenceId: string,
        referenceType: "PageRef",
      ) => {
        if (
          !state.navigation ||
          !state.locale ||
          !state.navigation[state.locale]
        )
          return null;
        const page =
          referenceType === "PageRef"
            ? state.navigation[state.locale].idMap[referenceId]
            : null;
        return page ? page.seoRoute : null;
      },
    },
  };
}
const createStore = (mode: FSXAContentMode, params: FSXAModuleParams) => {
  const store = new Vuex.Store<RootState>({
    modules: {
      fsxa: {
        ...getFSXAModule<RootState>(mode, params),
      },
    },
  });
  return store;
};
export default createStore;
