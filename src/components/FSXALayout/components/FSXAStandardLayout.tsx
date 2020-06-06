import Component from "vue-class-component";
import FSXABaseLayout from "./FSXABaseLayout";

@Component({
  name: "FSXAStandardLayout",
})
class FSXAStandardLayout extends FSXABaseLayout {
  render() {
    if (this.content.length === 0) return null;
    return (
      <div data-preview-id={this.content[0].previewId}>
        {this.content.length > 0 &&
          this.renderContentElements(this.content[0].children)}
      </div>
    );
  }
}
export default FSXAStandardLayout;
