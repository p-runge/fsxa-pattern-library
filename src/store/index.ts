import Vue from "vue";
import Vuex, { Module } from "vuex";
import { isEqual } from "lodash";
import { RootState, FSXAConfiguration, FSXAVuexState } from "../types/store";
import FSXAApi, { NavigationData } from "fsxa-api";
import axios from "axios";

// TODO: Split up store into separate chunks: getters, mutations, actions, state and use constants for the action names
// check if we can require the config folder
Vue.use(Vuex);

const prefix = "fsxa";

const NAVIGATION_DATA_KEY = "navigationData";

const ACTION_FETCH_NAVIGATION = "fetchNavigation";
const ACTION_SET_CONFIGURATION = "setConfiguration";
const ACTION_SET_INITIAL_STATE_FROM_SERVER = "setInitialStateFromServer";
const ACTION_SET_STORED_ITEM = "setStoredItem";

export const FSXAActions = {
  [ACTION_FETCH_NAVIGATION]: `${prefix}/${ACTION_FETCH_NAVIGATION}`,
  [ACTION_SET_CONFIGURATION]: `${prefix}/${ACTION_SET_CONFIGURATION}`,
  [ACTION_SET_INITIAL_STATE_FROM_SERVER]: `${prefix}/${ACTION_SET_INITIAL_STATE_FROM_SERVER}`,
  [ACTION_SET_STORED_ITEM]: `${prefix}/${ACTION_SET_STORED_ITEM}`
};

const GETTER_NAVIGATION_DATA = "navigationData";
const GETTER_CONFIGURATION = "configuration";
const GETTER_LOCALE = "locale";
const GETTER_ITEM = "item";
const GETTER_PAGE_BY_URL = "getPageIdByUrl";

export const FSXAGetters = {
  [GETTER_NAVIGATION_DATA]: `${prefix}/${GETTER_NAVIGATION_DATA}`,
  [GETTER_CONFIGURATION]: `${prefix}/${GETTER_CONFIGURATION}`,
  [GETTER_LOCALE]: `${prefix}/${GETTER_LOCALE}`,
  [GETTER_ITEM]: `${prefix}/${GETTER_ITEM}`,
  [GETTER_PAGE_BY_URL]: `${prefix}/${GETTER_PAGE_BY_URL}`
};

export function getFSXAModule<R extends RootState>(
  fsxaAPI: FSXAApi
): Module<FSXAVuexState, R> {
  return {
    state: () => ({
      stored: {},
      configuration: fsxaAPI.getConfiguration()
    }),
    actions: {
      [ACTION_SET_INITIAL_STATE_FROM_SERVER]: function(
        { commit },
        payload: FSXAVuexState
      ) {
        commit("setInitialStateFromServer", payload);
      },
      [ACTION_FETCH_NAVIGATION]: async function({ commit }) {
        if (!this.state.fsxa.configuration) {
          throw new Error("No FSXAConfiguration could be found.");
        }
        try {
          const response = await fsxaAPI.fetchNavigation();
          commit("setItem", { key: NAVIGATION_DATA_KEY, value: response });
        } catch (error) {
          commit("setItem", { key: NAVIGATION_DATA_KEY, value: null });
        }
      },
      [ACTION_SET_CONFIGURATION]: async function(
        { commit, dispatch },
        payload: FSXAConfiguration
      ) {
        if (!isEqual(this.state.fsxa.configuration || {}, payload)) {
          // check if navigation-data has to be fetched again
          const refetchNavigation =
            this.state.fsxa.configuration?.locale !== payload.locale ||
            this.state.fsxa.configuration?.navigationService !==
              payload.navigationService;
          fsxaAPI.setConfiguration(payload);
          commit("setConfiguration", payload);
          if (refetchNavigation) dispatch("fetchNavigation");
        }
      },
      [ACTION_SET_STORED_ITEM]: async function(
        { commit },
        { key, value }: { key: string; value: any }
      ) {
        commit("setItem", { key, value });
      }
    },
    mutations: {
      setItem(state, { key, value }) {
        Vue.set(state.stored, key, value);
      },
      setConfiguration(state, configuration: FSXAConfiguration) {
        Vue.set(state, "configuration", configuration);
      },
      setInitialStateFromServer(state, initialStateFromServer: FSXAVuexState) {
        Vue.set(state, "configuration", initialStateFromServer.configuration);
        Vue.set(state, "stored", initialStateFromServer.stored);
      }
    },
    getters: {
      [GETTER_NAVIGATION_DATA]: function(state): NavigationData | null {
        return state.stored[NAVIGATION_DATA_KEY] || null;
      },
      [GETTER_CONFIGURATION]: function(state): FSXAConfiguration | null {
        return state.configuration || null;
      },
      [GETTER_LOCALE]: function(state): string | null {
        return state.configuration?.locale || null;
      },
      [GETTER_ITEM]: (state): any => (id: string) => state.stored[id] || null,
      [GETTER_PAGE_BY_URL]: (state, getters) => (url: string) => {
        const navigationData = getters[FSXAGetters[GETTER_NAVIGATION_DATA]];
        if (!navigationData) return null;
        return (navigationData as NavigationData).pathMap[url] || null;
      }
    }
  };
}
const createStore = (fxsaConfiguration?: FSXAConfiguration) => {
  const store = new Vuex.Store<RootState>({
    modules: {
      fsxa: {
        namespaced: true,
        ...getFSXAModule<RootState>(new FSXAApi(axios, fxsaConfiguration))
      }
    }
  });
  return store;
};
export default createStore;
