import Component from "vue-class-component";
import { Prop, Provide } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { FSXAActions, FSXAGetters } from "@/store";
import {
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_DEBUG_MODE,
  FSXA_INJECT_KEY_EDIT_MODE,
} from "@/constants";
import { FSXAConfigProviderProps } from "@/types/components";

@Component({
  name: "FSXAConfigProvider",
})
class FSXAConfigProvider extends tsx.Component<FSXAConfigProviderProps> {
  @Prop() config!: FSXAConfigProviderProps["config"];
  @Prop({ default: false }) debugMode!: FSXAConfigProviderProps["debugMode"];
  @Prop({ default: false }) editMode!: FSXAConfigProviderProps["editMode"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) layouts!: FSXAConfigProviderProps["layouts"];
  // eslint-disable-next-line
  @Prop({ default: () => {} }) sections!: FSXAConfigProviderProps["sections"];

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

  get currentFSXAConfiguration() {
    return this.$store.getters[FSXAGetters.configuration];
  }

  setConfiguration() {
    if (this.config) {
      console.log("Will update configuration");
      this.$store.dispatch(FSXAActions.setConfiguration, this.config);
    }
  }

  render() {
    return this.$slots.default;
  }
}
export default FSXAConfigProvider;
