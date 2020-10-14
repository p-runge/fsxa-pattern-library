import { Component as TsxComponent } from "vue-tsx-support";
import { Component, Inject } from "vue-property-decorator";
import { FSXA_INJECT_KEY_DEV_MODE } from "@/constants";
import { RequestRouteChangeParams } from "@/types/components";
import { FSXAGetters, FSXAActions, getFSXAConfiguration } from "@/store";
import { FSXAApi, FSXAContentMode, NavigationData } from "fsxa-api";

@Component
class BaseComponent<Props> extends TsxComponent<Props> {
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

  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  get locale() {
    return this.$store.state.fsxa.locale;
  }

  get navigationData(): NavigationData | null {
    return this.$store.state.fsxa.navigation;
  }

  get fsxaApi(): FSXAApi {
    return new FSXAApi(
      this.isEditMode ? FSXAContentMode.PREVIEW : FSXAContentMode.RELEASE,
      getFSXAConfiguration(this.$store.state.fsxa.configuration),
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
export default BaseComponent;
