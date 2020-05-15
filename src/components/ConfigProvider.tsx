import { ConfigProviderProps } from "@/types/config-provider";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Fragment } from "vue-fragment";
import * as tsx from "vue-tsx-support";
import { FSXAGetters, FSXAActions } from "@/store";

@Component({
  name: "ConfigProvider"
})
class ConfigProvider extends tsx.Component<ConfigProviderProps> {
  @Prop({ required: true }) config!: ConfigProviderProps["config"];

  get configuration() {
    return this.$store.getters[FSXAGetters.configuration];
  }

  beforeMount() {
    this.setConfiguration();
  }

  beforeUpdate() {
    this.setConfiguration();
  }

  setConfiguration() {
    // pass configuration to the vuex store
    this.$store.dispatch(FSXAActions.setConfiguration, this.config);
  }

  render() {
    return <Fragment>{this.$slots.default}</Fragment>;
  }
}
export default ConfigProvider;
