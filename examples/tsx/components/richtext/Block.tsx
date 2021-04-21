import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "Block",
})
class Block extends FSXABaseRichTextElement {
  render() {
    return <div>{this.renderContent()}</div>;
  }
}
export default Block;
