import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "ListItem",
})
class ListItem extends FSXABaseRichTextElement {
  render() {
    return <li>{this.renderContent()}</li>;
  }
}
export default ListItem;
