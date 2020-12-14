import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "TextComponent",
})
class Text extends FSXABaseRichTextElement {
  render() {
    if (this.data.format === "bold") return <strong>{this.content}</strong>;
    if (this.data.format === "italic") return <em>{this.content}</em>;
    return typeof this.content === "string" ? (
      <span domPropsInnerHTML={this.content} />
    ) : (
      <span>{this.content}</span>
    );
  }
}
export default Text;
