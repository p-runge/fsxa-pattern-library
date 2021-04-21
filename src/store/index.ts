import Vue from "vue";
import Vuex, { Module } from "vuex";
import {
  FSXAApi,
  NavigationData,
  FSXAApiParams,
  FSXAContentMode,
  GCAPage,
  FSXAConfiguration,
  LogLevel,
  NavigationItem,
  ComparisonQueryOperatorEnum,
} from "fsxa-api";

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

export type HandleNextRoutePayload = {
  route: string;
  skipAppStateTransition?: boolean;
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
  routing = "routing",
  error = "error",
}
export interface CurrentPage {
  locale: string;
  route: string;
  datasetId?: string;
  item: NavigationItem;
}
export interface FSXAVuexState {
  defaultLocale: string;
  currentPage: CurrentPage | null;
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

Vue.use(Vuex);

const prefix = "fsxa";

const Actions = {
  setGlobalData: "setGlobalData",
  initializeApp: "initializeApp",
  determineCurrentPage: "determineCurrentPage",
  hydrateClient: "hydrateClient",
  setStoredItem: "setStoredItem",
};

export const FSXAActions = {
  setGlobalData: `${prefix}/${Actions.setGlobalData}`,
  initializeApp: `${prefix}/${Actions.initializeApp}`,
  determineCurrentPage: `${prefix}/${Actions.determineCurrentPage}`,
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
const GETTER_CURRENT_PAGE = "currentPage";

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
  [GETTER_CURRENT_PAGE]: `${prefix}/${GETTER_CURRENT_PAGE}`,
};

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAModuleParams,
): Module<FSXAVuexState, R> {
  return {
    namespaced: true,
    state: () => ({
      currentPage: null,
      defaultLocale: "",
      stored: {},
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
        { commit, dispatch },
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
        commit("setAppAsInitializing", {
          forceRefresh: payload.forceRefresh,
          defaultLocale: payload.defaultLocale,
        });
        try {
          const fsxaAPI = new FSXAApi(
            this.state.fsxa.mode as FSXAContentMode,
            getFSXAConfiguration(this.state.fsxa.configuration),
            this.state.fsxa.configuration.logLevel,
          );
          const navigation: Record<string, NavigationData> = {};
          const settings: Record<string, any> = {};
          if (payload.availableLocales) {
            // TODO: check if data is already set
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
                (settings[payload.availableLocales![index]] = localSettings
                  ? localSettings[0]
                  : null),
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
          // we will set the navigation-data and settings
          // then call handleRouteChange
          // and after that commit setAppAsInitialized
          commit("setGlobalData", {
            navigation,
            settings,
          });
          // we will not determine the current page
          await dispatch(Actions.determineCurrentPage, {
            route: path,
            skipAppStateTransition: true,
          });
          commit("setAppState", FSXAAppState.ready);
        } catch (error) {
          commit("setAppState", FSXAAppState.error);
          commit("setError", {
            message: error.message,
            stacktrace: error.stack,
          });
          return;
        }
      },
      [Actions.determineCurrentPage]: async function(
        { commit, state },
        payload: HandleNextRoutePayload,
      ) {
        if (!payload.skipAppStateTransition) {
          commit("setAppState", FSXAAppState.routing);
        }
        // initialize fsxa-api
        const fsxaAPI = new FSXAApi(
          state.mode as FSXAContentMode,
          getFSXAConfiguration(this.state.fsxa.configuration),
          state.configuration.logLevel,
        );

        let currentPage: CurrentPage | null = null;

        //  we will loop over all available navigationData and start with the current locale
        const currentLocale = state.currentPage
          ? state.currentPage.locale
          : state.defaultLocale;

        const locales = [
          currentLocale,
          ...Object.keys(state.navigation).filter(
            locale => locale !== currentLocale,
          ),
        ];
        const navigation = { ...state.navigation };
        for (const locale in locales) {
          const navigationData = navigation[locale];
          if (!navigationData) continue;
          // check if route exists in seoRouteMap
          const navigationItem =
            (navigationData.seoRouteMap[payload.route] &&
            navigationData.idMap[navigationData.seoRouteMap[payload.route]]
              ? navigationData.idMap[navigationData.seoRouteMap[payload.route]]
              : Object.values(navigationData.idMap)
                  .filter(item => item.seoRouteRegex)
                  .find(item => payload.route.match(item.seoRouteRegex!))) ||
            null;
          if (navigationItem) {
            currentPage = {
              route: payload.route,
              locale,
              item: navigationItem,
            };
          }
        }
        if (!currentPage) {
          // we did not find the route in the currently available locales
          // we will now do a request against the navigation-service to hopefully receive a valid response
          const newNavData = await fsxaAPI.fetchNavigation(
            decodeURI(payload.route),
            state.defaultLocale,
          );

          if (newNavData) {
            // we will now add the new navigation-data and the currentPage
            const item =
              payload.route === "/"
                ? newNavData.idMap[
                    newNavData.seoRouteMap[newNavData.pages.index]
                  ]
                : // the requested route will always be present in the seoRouteMap (even if it is a route to a dataset)
                  newNavData.idMap[newNavData.seoRouteMap[payload.route]];
            currentPage = {
              locale: newNavData.meta.identifier.languageId,
              route: payload.route,
              item,
            };
            navigation[currentPage.locale] = newNavData;
          }
        }

        // we did not find any existing route if currentPage is still empty --> this will lead to the 404 page to be shown
        // since the currentPage's default is null, we will leave it as it is
        // set current page and update navigation data

        if (currentPage && currentPage.item.seoRouteRegex) {
          // check if we already loaded the dataset
          // fetch dataset id from caas
          const [dataset] = await fsxaAPI.fetchByFilter(
            [
              {
                operator: ComparisonQueryOperatorEnum.EQUALS,
                field: "route",
                value: payload.route,
              },
            ],
            currentPage.locale,
          );
          if (dataset) {
            commit("setStoredItem", {
              key: dataset.id,
              value: dataset,
              fetchedAt: new Date().getTime(),
              ttl: 300000,
              locale: currentPage.locale,
            });
            currentPage.datasetId = dataset.id;
          }
        }
        commit("setCurrentPage", {
          currentPage,
          navigation,
        });
        if (!payload.skipAppStateTransition) {
          commit("setAppState", FSXAAppState.ready);
        }
        return currentPage;
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
      setCurrentPage(
        state,
        payload: {
          currentPage: CurrentPage | null;
          navigation: Record<string, NavigationData>;
        },
      ) {
        state.currentPage = payload.currentPage;
        state.navigation = payload.navigation;
      },
      setAppAsInitializing(
        state,
        {
          forceRefresh = false,
          defaultLocale,
        }: {
          forceRefresh: boolean;
          defaultLocale: string;
        },
      ) {
        state.appState = FSXAAppState.initializing;
        state.defaultLocale = defaultLocale;
        if (forceRefresh) {
          state.navigation = {};
          state.settings = {};
          state.stored = {};
        }
        state.error = null;
      },
      setStoredItem(state, { key, value, fetchedAt, ttl, locale }) {
        const currentLocale =
          locale ||
          (state.currentPage && state.currentPage.locale) ||
          state.defaultLocale ||
          null;
        if (!currentLocale) return;
        state.stored = {
          ...state.stored,
          [currentLocale]: {
            ...state.stored[currentLocale],
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
      [GETTER_NAVIGATION_DATA]: function(state, getters) {
        const locale = getters[GETTER_LOCALE];
        return (state.navigation && locale && state.navigation[locale]) || null;
      },
      [GETTER_SETTINGS]: function(state, getters) {
        const locale = getters[GETTER_LOCALE];
        return (state.settings && locale && state.settings[locale]) || null;
      },
      [GETTER_CONFIGURATION]: function(state) {
        return state.configuration || null;
      },
      [GETTER_LOCALE]: function(state) {
        return (
          (state.currentPage && state.currentPage.locale) ||
          state.defaultLocale ||
          null
        );
      },
      [GETTER_ITEM]: (state, getters): any => (id: string) => {
        const locale = getters[GETTER_LOCALE];
        return (
          (locale && state.stored[locale] && state.stored[locale][id]) || null
        );
      },
      [GETTER_PAGE_BY_URL]: (state, getters) => (url: string) => {
        const navigationData = getters[FSXAGetters[GETTER_NAVIGATION_DATA]];
        if (!navigationData) return null;
        return (navigationData as NavigationData).seoRouteMap[url] || null;
      },
      [GETTER_MODE]: (state): FSXAContentMode => state.mode as FSXAContentMode,
      [GETTER_REFERENCE_URL]: (state, getters) => (
        referenceId: string,
        referenceType: "PageRef",
      ) => {
        const locale = getters[GETTER_LOCALE]();
        if (!state.navigation || !locale || !state.navigation[locale])
          return null;
        const page =
          referenceType === "PageRef"
            ? state.navigation[locale].idMap[referenceId]
            : null;
        return page ? page.seoRoute : null;
      },
      [GETTER_CURRENT_PAGE]: state => state.currentPage || null,
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
