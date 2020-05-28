import BaseLayout from "./BaseLayout";
import Section from "@/components/Section";
import Component from "vue-class-component";

@Component({
  name: "StandardLayout"
})
class StandardLayout extends BaseLayout {
  render() {
    if (this.content.length === 0) return null;
    return (
      <div data-preview-id={this.content[0].previewId}>
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
export default StandardLayout;
