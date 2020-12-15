import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "List",
})
class List extends FSXABaseRichTextElement {
  render() {
    return <ul>{this.renderContent()}</ul>;
  }
}
export default List;
