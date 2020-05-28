import { ConfigProviderProps } from "@/types/config-provider";
import Component from "vue-class-component";
import { Prop, Provide } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { FSXAActions } from "@/store";
import {
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_DEBUG_MODE,
  FSXA_INJECT_KEY_EDIT_MODE
} from "@/constants";

@Component({
  name: "ConfigProvider"
})
class ConfigProvider extends tsx.Component<ConfigProviderProps> {
  @Prop() config!: ConfigProviderProps["config"];
  @Prop({ default: false }) debugMode!: ConfigProviderProps["debugMode"];
  @Prop({ default: false }) editMode!: ConfigProviderProps["editMode"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) layouts!: ConfigProviderProps["layouts"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) sections!: ConfigProviderProps["sections"];

  @Provide(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts = this.layouts;
  @Provide(FSXA_INJECT_KEY_SECTIONS) injectedSections = this.sections;
  @Provide(FSXA_INJECT_KEY_DEBUG_MODE) injectedDebugMode = this.debugMode;
  @Provide(FSXA_INJECT_KEY_EDIT_MODE) injectedEditMode = this.editMode;

  beforeMount() {
    this.setConfiguration();
  }

  beforeUpdate() {
    this.setConfiguration();
  }

  setConfiguration() {
    if (this.config) {
      this.$store.dispatch(FSXAActions.setConfiguration, this.config);
    }
  }

  render() {
    return this.$slots.default;
  }
}
export default ConfigProvider;
