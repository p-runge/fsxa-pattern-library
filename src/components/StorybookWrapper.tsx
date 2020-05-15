import "fsxa-ui/dist/fsxa-ui.css";
import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";

@Component({ name: "StorybookWrapper" })
class StorybookWrapper extends tsx.Component<{}> {
  render() {
    return this.$slots.default;
  }
}
export default StorybookWrapper;
