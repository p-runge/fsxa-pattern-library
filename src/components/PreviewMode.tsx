import * as tsx from "vue-tsx-support";
import Component from "vue-class-component";
import { Provide } from "vue-property-decorator";
import { Fragment } from "vue-fragment";

export const IS_PREVIEW_MODE_KEY = "isPreviewMode";

@Component({
  name: "PreviewMode"
})
class PreviewMode extends tsx.Component<{}> {
  @Provide(IS_PREVIEW_MODE_KEY) previewMode = true;

  render() {
    return <Fragment>{this.$slots.default}</Fragment>;
  }
}
export default PreviewMode;
