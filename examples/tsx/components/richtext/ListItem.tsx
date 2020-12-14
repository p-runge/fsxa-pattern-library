import { FSXABaseRichTextElement, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "ListItem",
})
class ListItem extends FSXABaseRichTextElement {
  render() {
    return (
      <li>
        <FSXARichText content={this.content} />
      </li>
    );
  }
}
export default ListItem;
