import { FSXAActions } from "./../store";
import { NavigationData } from "fsxa-api/dist/types";
import { Component, Prop } from "vue-property-decorator";
import { Component as TsxComponent } from "vue-tsx-support";

export interface StaticProps {
  navigationData: Record<string, NavigationData>;
  globalSettings?: Record<string, any>;
}
@Component({
  name: "static",
})
class Static extends TsxComponent<StaticProps> {
  @Prop({ required: true }) navigationData!: StaticProps["navigationData"];
  @Prop() globalSettings: StaticProps["globalSettings"];

  serverPrefetch() {
    return this.$store.dispatch(FSXAActions.setGlobalData, {
      navigation: this.navigationData,
      settings: this.globalSettings,
    });
  }

  render() {
    // we will return the data
    return this.$slots.default;
  }
}
export default Static;
