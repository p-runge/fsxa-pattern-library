import Vue from "vue";
import Vuex, { Module } from "vuex";
import FSXAApi, {
  NavigationData,
  Page,
  MappedNavigationItem,
  FSXAApiParams,
  FSXAContentMode,
  FSXAConfiguration,
} from "fsxa-api";
export declare type FSXAModuleParams =
  | {
      mode: "proxy";
      baseUrl: {
        client: string;
        server: string;
      };
    }
  | {
      mode: "remote";
      config: FSXAConfiguration;
    };
export interface CurrentPage extends MappedNavigationItem {
  content: Page;
}
export interface FSXAAppError {
  message: string;
  description?: string;
  stacktrace?: string;
}
export enum FSXAAppState {
  not_initialized = "not_initialized",
  initializing = "initializing",
  ready = "ready",
  fetching = "fetching",
  fetching_error = "fetching_error",
  error = "error",
}
export interface FSXAVuexState {
  locale?: string;
  configuration: FSXAModuleParams;
  appState: FSXAAppState;
  currentPageId: string | null;
  navigation: NavigationData | null;
  settings: any | null;
  error: FSXAAppError | null;
  stored: {
    [key: string]: any;
  };
  mode: "release" | "preview";
}
export interface RootState {
  fsxa: FSXAVuexState;
}

// check if we can require the config folder
Vue.use(Vuex);

const prefix = "fsxa";

export const NAVIGATION_DATA_KEY = "navigationData";
export const GLOBAL_SETTINGS_KEY = "global_settings";

const Actions = {
  initialize: "initialize",
  fetchNavigation: "fetchNavigation",
  fetchPage: "fetchPage",
  hydrateClient: "hydrateClient",
  setStoredItem: "setStoredItem",
  fetchSettings: "fetchSettings",
  pathChanged: "pathChanged",
};

const Getters = {
  appState: "appState",
  error: "error",
  currentPage: "currentPage",
};

export const FSXAActions = {
  initialize: `${prefix}/${Actions.initialize}`,
  fetchNavigation: `${prefix}/${Actions.fetchNavigation}`,
  fetchPage: `${prefix}/${Actions.fetchPage}`,
  hydrateClient: `${prefix}/${Actions.hydrateClient}`,
  setStoredItem: `${prefix}/${Actions.setStoredItem}`,
  fetchSettings: `${prefix}/${Actions.fetchSettings}`,
};

const getFSXAConfiguration = (config: FSXAModuleParams): FSXAApiParams => {
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

export const FSXAGetters = {
  [Getters.appState]: `${prefix}/${Getters.appState}`,
  [Getters.error]: `${prefix}/${Getters.error}`,
  [Getters.currentPage]: `${prefix}/${Getters.currentPage}`,
  [GETTER_NAVIGATION_DATA]: `${prefix}/${GETTER_NAVIGATION_DATA}`,
  [GETTER_CONFIGURATION]: `${prefix}/${GETTER_CONFIGURATION}`,
  [GETTER_LOCALE]: `${prefix}/${GETTER_LOCALE}`,
  [GETTER_ITEM]: `${prefix}/${GETTER_ITEM}`,
  [GETTER_PAGE_BY_URL]: `${prefix}/${GETTER_PAGE_BY_URL}`,
  [GETTER_MODE]: `${prefix}/${GETTER_MODE}`,
};

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAModuleParams,
): Module<FSXAVuexState, R> {
  return {
    namespaced: true,
    state: () => ({
      stored: {},
      currentPageId: null,
      navigation: null,
      settings: null,
      appState: FSXAAppState.not_initialized,
      error: null,
      mode,
      configuration: params,
    }),
    actions: {
      [Actions.initialize]: async function(
        { commit },
        payload: {
          locale: string;
          path?: string;
          pageId?: string;
          isClient: string;
        },
      ) {
        // Set app state to initializing
        commit("startInitialization", payload.locale);
        try {
          const fsxaAPI = new FSXAApi(
            mode,
            getFSXAConfiguration(this.state.fsxa.configuration),
          );
          // fetch navigation data
          const [navigationData, settings] = await Promise.all([
            fsxaAPI.fetchNavigation(payload.locale),
            fsxaAPI.fetchGCAPage(payload.locale, GLOBAL_SETTINGS_KEY),
          ]);
          if (!navigationData && !settings) {
            commit("setError", {
              appState: FSXAAppState.error,
              error: {
                message:
                  "Could not load navigation-data and global settings GCAPage",
                description:
                  "Neither the data from the navigation service nor the global settings page in the CaaS could be loaded. Please check your configuration.",
              },
            });
            return;
          } else if (!navigationData) {
            commit("setError", {
              appState: FSXAAppState.error,
              error: {
                message:
                  "Could not fetch navigation-data from NavigationService",
                description:
                  "Please make sure that the Navigation-Service is available and your config is correct. See the documentation for more information.",
              },
            });
            return;
          } else if (!settings) {
            commit("setError", {
              appState: FSXAAppState.error,
              error: {
                message: "Could not fetch global settings via GCAPage",
                description: `Please make sure that you do have a GCAPage defined in your project. The identifier that is searched for is: [${GLOBAL_SETTINGS_KEY}]. See the documentation for more information.`,
              },
            });
            return;
          }
          commit("setGlobalData", {
            navigationData,
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
        // dispatch fetchPage action
        return await this.dispatch(FSXAActions.fetchPage, {
          locale: payload.locale,
          path: payload.path,
          pageId: payload.pageId,
          isClient: payload.isClient,
        });
      },
      [Actions.fetchPage]: async function(
        { commit },
        payload: {
          locale?: string;
          path?: string;
          pageId?: string;
          isClient: boolean;
        },
      ) {
        const locale = payload.locale || this.state.fsxa.locale;
        if (!locale) return null;
        try {
          const navigationData = this.state.fsxa.navigation;
          if (!navigationData) return;
          if (!payload.pageId && !payload.path)
            throw new Error("You have to pass pageId or path");
          let requestedPageId = null;
          if (payload.path)
            requestedPageId = navigationData.pathMap[payload.path];
          if (payload.pageId) requestedPageId = payload.pageId;

          if (
            !requestedPageId &&
            payload.path &&
            ["", "/"].indexOf(payload.path) !== -1
          )
            requestedPageId = navigationData.indexPage.id;
          if (requestedPageId) {
            // do not load data if page already exists
            if (this.state.fsxa.stored[requestedPageId + "." + locale]) {
              commit("setCurrentPage", requestedPageId);
              return navigationData.idMap[requestedPageId].path;
            }
            commit("setAppState", FSXAAppState.fetching);
            const contentReferenceId =
              navigationData.idMap[requestedPageId].contentReferenceId;
            const fsxaAPI = new FSXAApi(
              mode,
              getFSXAConfiguration(this.state.fsxa.configuration),
            );
            const [page] = await Promise.all([
              fsxaAPI.fetchPage(contentReferenceId, locale),
              new Promise(resolve =>
                setTimeout(resolve, payload.isClient ? 300 : 0),
              ),
            ]);
            if (!page) {
              commit("setError", {
                appState: FSXAAppState.fetching_error,
                error: {
                  message: "Could not fetch page",
                  description: "We were not able to fetch your requested page.",
                },
              });
              return;
            }
            commit("setFetchedPage", {
              pageId: requestedPageId,
              locale: locale,
              data: page,
            });
            return navigationData.idMap[requestedPageId].path;
          } else {
            // if we did not find any valid page, we set appState to fetching_error so the application can show an error
            commit("setError", {
              appState: FSXAAppState.fetching_error,
              error: {
                message: `Could not find page for given path: ${payload.path}`,
                description: "",
              },
            });
          }
        } catch (error) {
          commit("setError", {
            appState: FSXAAppState.error,
            error: {
              message: error.message,
              stacktrace: error.stacktrace,
            },
          });
        }
      },
      [Actions.hydrateClient]: function({ commit }, payload: FSXAVuexState) {
        commit("setInitialStateFromServer", payload);
      },
      [Actions.setStoredItem]: async function(
        { commit },
        { key, value }: { key: string; value: any },
      ) {
        commit("setItem", { key, value });
      },
    },
    mutations: {
      setFetchedPage(
        state,
        payload: { pageId: string; locale: string; data: any },
      ) {
        Vue.set(state, "stored", {
          ...state.stored,
          [payload.pageId + "." + payload.locale]: payload.data,
        });
        Vue.set(state, "currentPageId", payload.pageId);
        Vue.set(state, "appState", FSXAAppState.ready);
      },
      setCurrentPage(state, pageId: string) {
        Vue.set(state, "currentPageId", pageId);
      },
      startInitialization(state, locale: string) {
        Vue.set(state, "appState", FSXAAppState.initializing);
        Vue.set(state, "locale", locale);
        // we reset all stored data
        Vue.set(state, "stored", {});
      },
      setGlobalData(
        state,
        payload: { navigationData: NavigationData; settings: any },
      ) {
        Vue.set(state, "navigation", payload.navigationData);
        Vue.set(state, "settings", payload.settings);
      },
      setStoredItem(state, { key, value }) {
        Vue.set(state.stored, key, value);
      },
      setStoredItems(state, payload: { [key: string]: any }) {
        Vue.set(state, "stored", {
          ...state.stored,
          ...payload,
        });
      },
      setConfiguration(state, configuration) {
        Vue.set(state, "configuration", configuration);
      },
      setInitialStateFromServer(state, initialStateFromServer: FSXAVuexState) {
        Vue.set(state, "configuration", initialStateFromServer.configuration);
        Vue.set(state, "currentPageId", initialStateFromServer.currentPageId);
        Vue.set(state, "navigation", initialStateFromServer.navigation);
        Vue.set(state, "settings", initialStateFromServer.settings);
        Vue.set(state, "appState", initialStateFromServer.appState);
        Vue.set(state, "error", initialStateFromServer.error);
        Vue.set(state, "stored", initialStateFromServer.stored);
      },
      setLocale(state, locale) {
        Vue.set(state, "locale", locale);
      },
      setAppState(state, appState) {
        Vue.set(state, "appState", appState);
      },
      setError(
        state,
        payload: {
          error: FSXAAppError | null;
          appState?: FSXAAppState;
        },
      ) {
        if (payload.appState) {
          Vue.set(state, "appState", payload.appState);
        }
        Vue.set(state, "error", payload.error);
      },
    },
    getters: {
      [Getters.appState]: function(state): FSXAAppState {
        return state.appState;
      },
      [Getters.error]: function(state) {
        return state.error;
      },
      [Getters.currentPage]: function(state): CurrentPage | null {
        if (!state.currentPageId) return null;
        if (!state.navigation) return null;
        return {
          ...state.navigation.idMap[state.currentPageId],
          content: state.stored[state.currentPageId + "." + state.locale],
        };
      },
      [GETTER_NAVIGATION_DATA]: function(state) {
        return state.navigation || null;
      },
      [GETTER_CONFIGURATION]: function(state) {
        return state.configuration || null;
      },
      [GETTER_LOCALE]: function(state) {
        return state.locale || null;
      },
      [GETTER_ITEM]: (state): any => (id: string) => state.stored[id] || null,
      [GETTER_PAGE_BY_URL]: (state, getters) => (url: string) => {
        const navigationData = getters[FSXAGetters[GETTER_NAVIGATION_DATA]];
        if (!navigationData) return null;
        return (navigationData as NavigationData).pathMap[url] || null;
      },
      [GETTER_MODE]: (state): FSXAContentMode => state.mode,
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
