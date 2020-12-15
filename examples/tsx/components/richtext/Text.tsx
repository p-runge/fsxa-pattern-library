import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "TextComponent",
})
class Text extends FSXABaseRichTextElement {
  render() {
    if (this.data.format === "bold")
      return <strong>{this.renderContent()}</strong>;
    if (this.data.format === "italic") return <em>{this.renderContent()}</em>;
    return typeof this.content === "string" ? (
      <span domPropsInnerHTML={this.content} />
    ) : (
      <span>{this.renderContent()}</span>
    );
  }
}
export default Text;
