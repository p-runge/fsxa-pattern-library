import BaseComponent from "./BaseComponent";
import { RenderLayoutParams } from "@/types/components";
import { Prop, Component } from "vue-property-decorator";

@Component({
  name: "BaseAppLayout",
})
class BaseAppLayout<Props = {}> extends BaseComponent<
  RenderLayoutParams & Props
> {
  @Prop({ required: true }) appState!: RenderLayoutParams["appState"];
  @Prop({ required: true }) appError!: RenderLayoutParams["appError"];
  @Prop({ required: true }) content!: RenderLayoutParams["content"];
  @Prop({ required: true })
  locales!: RenderLayoutParams["locales"];
  @Prop({ required: true })
  handleLocaleChange!: RenderLayoutParams["handleLocaleChange"];

  render() {
    throw new Error(
      "You have to define your own render-method in your AppLayout-Component",
    );
  }
}
export default BaseAppLayout;
