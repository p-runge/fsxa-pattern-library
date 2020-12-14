import { FSXABaseRichTextElement, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "List",
})
class List extends FSXABaseRichTextElement {
  render() {
    return (
      <ul>
        <FSXARichText content={this.content} />
      </ul>
    );
  }
}
export default List;
