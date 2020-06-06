import * as tsx from "vue-tsx-support";
import FSXAApi, { FSXAConfiguration } from "fsxa-api";
import { FSXAGetters, FSXAActions } from "@/store";
import axios from "axios";
import { Inject, Component } from "vue-property-decorator";
import {
  FSXA_INJECT_KEY_DEBUG_MODE,
  FSXA_INJECT_KEY_EDIT_MODE,
} from "@/constants";

@Component({
  name: "FSXABaseComponent",
})
class FSXABaseComponent<Props, Events = {}, Slots = {}> extends tsx.Component<
  Props,
  Events,
  Slots
> {
  @Inject({ from: FSXA_INJECT_KEY_DEBUG_MODE, default: false })
  isDebugMode!: boolean;
  @Inject({ from: FSXA_INJECT_KEY_EDIT_MODE, default: false })
  isEditMode!: boolean;

  get $fsxaAPI(): FSXAApi {
    return new FSXAApi(
      // we will inject axios defined in the store
      (this.$store as any).$axios || axios,
      this.$store.getters[FSXAGetters.configuration],
    );
  }

  get fsxaConfiguration(): FSXAConfiguration | null {
    return this.$store.getters[FSXAGetters.configuration];
  }

  get locale(): string {
    return this.$store.getters[FSXAGetters.locale];
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
