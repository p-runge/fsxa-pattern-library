import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "Paragraph",
})
class Paragraph extends FSXABaseRichTextElement {
  render() {
    return <p>{this.renderContent()}</p>;
  }
}
export default Paragraph;
