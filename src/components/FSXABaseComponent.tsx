import * as tsx from "vue-tsx-support";
import FSXAApi, { FSXAConfiguration } from "fsxa-api";
import { FSXAGetters, FSXAActions } from "@/store";
import axios from "axios";
import { Inject, Component } from "vue-property-decorator";
import { FSXA_INJECT_KEY_DEV_MODE } from "@/constants";
import { RequestRouteChangeParams } from "@/types/components";

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
      // we will inject axios defined in the store
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

  async fetchImage(url: string, resolution: string) {
    const response = await this.$fsxaAPI.fetchImageBlob(url, resolution);
    if (response) return URL.createObjectURL(response);
    return null;
  }

  async fetchImages(images: Array<{ url: string; resolution: string }>) {
    return await Promise.all(
      images.map(image => this.fetchImage(image.url, image.resolution)),
    );
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
