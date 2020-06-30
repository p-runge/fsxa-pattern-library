import Component from "vue-class-component";
import FSXABaseLayout from "./FSXABaseLayout";
import FSXAHeaderSection, {
  Payload as FSXAHeaderSectionPayload,
} from "@/components/FSXASection/components/FSXAHeaderSection";

@Component({
  name: "FSXAStandardLayout",
})
class FSXAStandardLayout extends FSXABaseLayout<FSXAHeaderSectionPayload> {
  render() {
    if (this.content.length === 0) return null;
    return (
      <div data-preview-id={this.content[0].previewId}>
        <FSXAHeaderSection
          payload={{
            pt_picture: this.data.pt_picture,
            pt_text: this.data.pt_text,
            pageId: this.pageId,
          }}
        />
        {this.content.length > 0 && this.renderContentElements(0)}
      </div>
    );
  }
}
export default FSXAStandardLayout;
