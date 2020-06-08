import { Prop, Component } from "vue-property-decorator";
import { BodyContent } from "fsxa-api";
import Section from "@/components/FSXASection";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { FSXABaseLayoutProps } from "@/types/components";

@Component({
  name: "BaseLayout",
})
class FSXABaseLayout<Data = {}, Meta = {}> extends FSXABaseComponent<
  FSXABaseLayoutProps<Data, Meta>
> {
  @Prop({ required: true }) pageId!: FSXABaseLayoutProps<Data, Meta>["pageId"];
  @Prop({ required: true }) data!: FSXABaseLayoutProps<Data, Meta>["data"];
  @Prop({ required: true }) meta!: FSXABaseLayoutProps<Data, Meta>["meta"];
  @Prop({ required: true }) content!: FSXABaseLayoutProps<
    Data,
    Meta
  >["content"];

  renderContentElement(content: BodyContent) {
    switch (content.type) {
      case "Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            meta={content.meta}
            id={content.id}
            previewId={content.previewId}
          />
        );
      case "DatasetReference":
        return <div>Dataset-Reference will go here</div>;
      default:
        return null;
    }
  }

  renderContentElements(contentElements: BodyContent[]) {
    return contentElements.map(this.renderContentElement);
  }
}
export default FSXABaseLayout;
