import * as tsx from "vue-tsx-support";
import FSXAApi, { FSXAConfiguration, NavigationData } from "fsxa-api";
import {
  FSXAGetters,
  FSXAActions,
  NAVIGATION_DATA_KEY,
  GLOBAL_SETTINGS_KEY,
} from "@/store";
import { Inject, Component } from "vue-property-decorator";
import { FSXA_INJECT_KEY_DEV_MODE } from "@/constants";
import { RequestRouteChangeParams } from "@/types/components";
import axios from "axios";

@Component({
  name: "FSXABaseComponent",
})
class FSXABaseComponent<Props, Events = {}, Slots = {}> extends tsx.Component<
  Props,
  Events,
  Slots
> {
  @Inject({ from: FSXA_INJECT_KEY_DEV_MODE, default: false })
  isDevMode!: boolean;
  @Inject({
    from: "requestRouteChange",
    default: () => (params: RequestRouteChangeParams) =>
      console.log(
        "Could not perform route change, since this component is not a child of an FSXAPage",
        params,
      ),
  })
  handleRouteChangeRequest!: (params: RequestRouteChangeParams) => void;

  get $fsxaAPI(): FSXAApi {
    return new FSXAApi(
      (this.$store as any).$axios || axios,
      this.$store.getters[FSXAGetters.configuration],
    );
  }

  get isEditMode() {
    return this.fsxaConfiguration?.mode === "preview";
  }

  get fsxaConfiguration(): FSXAConfiguration | null {
    return this.$store.getters[FSXAGetters.configuration];
  }

  get locale(): string {
    return this.$store.getters[FSXAGetters.locale];
  }

  get navigationData(): NavigationData | null {
    return this.getStoredItem(NAVIGATION_DATA_KEY);
  }

  get globalSettings(): any | null {
    return this.getStoredItem(GLOBAL_SETTINGS_KEY);
  }

  getStoredItem(key: string) {
    return this.$store.getters[FSXAGetters.item](key);
  }

  setStoredItem(key: string, value: any) {
    this.$store.dispatch(FSXAActions.setStoredItem, { key, value });
  }

  render() {
    throw new Error("You have to specify your own render-method");
  }
}
export default FSXABaseComponent;
