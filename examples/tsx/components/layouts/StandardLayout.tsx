import Component from "vue-class-component";
import { FSXABaseLayout } from "fsxa-pattern-library";

@Component({
  name: "StandardLayout",
})
class StandardLayout extends FSXABaseLayout {
  render() {
    return (
      <div class="w-full h-full">
        <div class="w-1/2 my-10">{this.renderContentByName("default")}</div>
        <div class="w-1/2 my-10">{this.renderContentByName("content")}</div>
      </div>
    );
  }
}
export default StandardLayout;
