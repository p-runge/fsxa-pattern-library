import { FSXABaseRichTextElement, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "Paragraph",
})
class Paragraph extends FSXABaseRichTextElement {
  render() {
    return (
      <p>
        <FSXARichText content={this.content} />
      </p>
    );
  }
}
export default Paragraph;
