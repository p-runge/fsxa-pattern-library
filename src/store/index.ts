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

const ACTION_FETCH_NAVIGATION = "fetchNavigation";
const ACTION_SET_CONFIGURATION = "setConfiguration";
const ACTION_SET_INITIAL_STATE_FROM_SERVER = "setInitialStateFromServer";

export const FSXAActions = {
  [ACTION_FETCH_NAVIGATION]: `${prefix}/${ACTION_FETCH_NAVIGATION}`,
  [ACTION_SET_CONFIGURATION]: `${prefix}/${ACTION_SET_CONFIGURATION}`,
  [ACTION_SET_INITIAL_STATE_FROM_SERVER]: `${prefix}/${ACTION_SET_INITIAL_STATE_FROM_SERVER}`
};

const GETTER_NAVIGATION_DATA = "navigationData";
const GETTER_CONFIGURATION = "configuration";

export const FSXAGetters = {
  [GETTER_NAVIGATION_DATA]: `${prefix}/${GETTER_NAVIGATION_DATA}`,
  [GETTER_CONFIGURATION]: `${prefix}/${GETTER_CONFIGURATION}`
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
        initialStateFromServer: FSXAVuexState
      ) {
        commit("setInitialStateFromServer", initialStateFromServer);
      },
      [ACTION_FETCH_NAVIGATION]: async function({ commit }) {
        if (!this.state.fsxa.configuration) {
          throw new Error("No FSXAConfiguration could be found.");
        }
        try {
          const response = await fsxaAPI.fetchNavigation();
          commit("setItem", { key: "navigationData", data: response });
        } catch (error) {
          commit("setItem", { key: "navigationData", data: null });
        }
      },
      [ACTION_SET_CONFIGURATION]: async function(
        { commit, dispatch },
        configuration
      ) {
        if (!isEqual(this.state.fsxa.configuration || {}, configuration)) {
          // check if navigation-data has to be fetched again
          const refetchNavigation =
            this.state.fsxa.configuration?.locale !== configuration.locale ||
            this.state.fsxa.configuration?.navigationService !==
              configuration.navigationService;
          fsxaAPI.setConfiguration(configuration);
          commit("setConfiguration", configuration);
          if (refetchNavigation) dispatch("fetchNavigation");
        }
      }
    },
    mutations: {
      setItem(state, { key, data }) {
        Vue.set(state.stored, key, data);
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
        return state.stored["navigationData"] || null;
      },
      [GETTER_CONFIGURATION]: function(state): FSXAConfiguration | null {
        return state.configuration || null;
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
