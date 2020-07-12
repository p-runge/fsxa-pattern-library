import Component from "vue-class-component";
import { Prop, Provide } from "vue-property-decorator";
import {
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_DEV_MODE,
} from "@/constants";
import BaseComponent from "./BaseComponent";
import { ConfigProviderProps } from "@/types/components";

@Component({
  name: "ConfigProvider",
})
class ConfigProvider extends BaseComponent<ConfigProviderProps> {
  @Prop({ default: false }) devMode!: ConfigProviderProps["devMode"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) layouts!: ConfigProviderProps["layouts"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) sections!: ConfigProviderProps["sections"];

  @Provide(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts = this.layouts;
  @Provide(FSXA_INJECT_KEY_SECTIONS) injectedSections = this.sections;
  @Provide(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;

  render() {
    return this.$slots.default;
  }
}
export default ConfigProvider;
