import * as tsx from "vue-tsx-support";
import FSXAApi, { FSXAConfiguration } from "fsxa-api";
import { FSXAGetters, FSXAActions } from "@/store";
import axios from "axios";
import { Inject, Component, Emit } from "vue-property-decorator";
import {
  FSXA_INJECT_KEY_DEBUG_MODE,
  FSXA_INJECT_KEY_EDIT_MODE,
} from "@/constants";
import { RequestRouteChangeParams } from "./FSXAPage";

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
  @Inject({
    from: "requestRouteChange",
    default: (params: RequestRouteChangeParams) =>
      console.log(
        "Could not perform route change, since this component is not a child of an FSXAPage",
        params,
      ),
  })
  handleRouteChangeRequest!: (params: RequestRouteChangeParams) => void;

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

  async fetchImage(url: string, resolution: string) {
    // check if image already exists
    const key = `${url}.${resolution}`;
    const storedItem = this.getStoredItem(key);
    if (storedItem) return storedItem;
    const response = await this.$fsxaAPI.fetchImageBlob(url, resolution);
    if (response) this.setStoredItem(key, response);
    return null;
  }

  async fetchImages(images: Array<{ url: string; resolution: string }>) {
    return await Promise.all(
      images.map(image => this.fetchImage(image.url, image.resolution)),
    );
  }

  getImage(url: string, resolution: string) {
    const storedItem = this.getStoredItem(`${url}.${resolution}`);
    if (storedItem && typeof URL !== "undefined")
      return URL.createObjectURL(storedItem);
    return null;
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
