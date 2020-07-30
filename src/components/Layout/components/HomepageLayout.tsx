import Component from "vue-class-component";
import BaseLayout from "./BaseLayout";
import { Layouts } from "fsxa-ui";

export interface Slide {
  previewId: string;
  identifier: string;
  data: any;
}
export interface Data {
  pt_show_chat: boolean;
  pt_slider: Slide[];
}
@Component({
  name: "HomepageLayout",
})
class HomepageLayout extends BaseLayout<Data> {
  render() {
    return (
      <Layouts.SingleColumnLayout data-preview-id={this.content[0].previewId}>
        {this.content.length && this.renderContentElements(0)}
      </Layouts.SingleColumnLayout>
    );
  }
}
export default HomepageLayout;
