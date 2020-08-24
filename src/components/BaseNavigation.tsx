import BaseComponent from "./BaseComponent";
import { RenderNavigationHookParams } from "@/types/components";
import { Prop, Component } from "vue-property-decorator";

@Component({
  name: "BaseNavigation",
})
class BaseNavigation<Props = {}> extends BaseComponent<
  RenderNavigationHookParams & Props
> {
  @Prop({ required: true }) locale!: RenderNavigationHookParams["locale"];
  @Prop({ required: true }) locales!: RenderNavigationHookParams["locales"];
  @Prop({ required: true })
  handleLocaleChange!: RenderNavigationHookParams["handleLocaleChange"];
  @Prop({ required: true })
  activePageId!: RenderNavigationHookParams["activePageId"];
  @Prop({ required: true })
  activeSeoRoute!: RenderNavigationHookParams["activeSeoRoute"];

  render() {
    throw new Error(
      "You have to define your own render-component in your Navigation-Component",
    );
  }
}
export default BaseNavigation;
