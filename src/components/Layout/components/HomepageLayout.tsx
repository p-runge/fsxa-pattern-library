import BaseLayout from "./BaseLayout";
import Component from "vue-class-component";
import Section from "@/components/Section";

export interface Slide<Data = any> {
  previewId: string;
  identifier: string;
  data: Data;
}
export interface HomepageLayoutData {
  pt_show_chat: boolean;
  pt_slider: Slide[];
}
@Component({
  name: "HomepageLayout"
})
class HomepageLayout extends BaseLayout<HomepageLayoutData> {
  render() {
    return (
      <div data-preview-id={this.content[0].previewId}>
        {/**<div class="w-full p-20 -mt-20 h-screen">
          <Slider slides={this.pt_slider} />
    </div>**/}
        {this.content.length > 0 &&
          this.content[0].children.map(sectionData => (
            <Section
              type={sectionData.sectionType}
              data={sectionData.data}
              meta={sectionData.meta}
              id={sectionData.id}
              previewId={sectionData.id}
            />
          ))}
      </div>
    );
  }
}
export default HomepageLayout;
