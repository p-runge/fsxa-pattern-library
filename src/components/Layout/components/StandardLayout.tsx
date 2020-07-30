import Component from "vue-class-component";
import FSXABaseLayout from "./BaseLayout";
import HeaderSection, {
  Payload as HeaderSectionPayload,
} from "@/components/Section/components/HeaderSection";
import { Layouts } from "fsxa-ui";

@Component({
  name: "FSXAStandardLayout",
})
class StandardLayout extends FSXABaseLayout<HeaderSectionPayload> {
  render() {
    if (this.content.length === 0) return null;
    return (
      <Layouts.SingleColumnLayout data-preview-id={this.content[0].previewId}>
        <HeaderSection
          payload={{
            pt_picture: this.data.pt_picture,
            pt_text: this.data.pt_text,
            pageId: this.pageId,
          }}
        />
        {this.content.length > 0 && this.renderContentElements(0)}
      </Layouts.SingleColumnLayout>
    );
  }
}
export default StandardLayout;
