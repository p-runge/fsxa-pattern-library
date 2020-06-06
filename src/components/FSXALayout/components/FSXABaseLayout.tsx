import { Prop, Component } from "vue-property-decorator";
import { Body, BodyContent } from "fsxa-api";
import Section from "@/components/FSXASection";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { FSXABaseLayoutProps } from "@/types/components";

export interface BaseLayoutProps<Data = {}, Meta = {}> {
  content: Body[];
  data: Data;
  meta: Meta;
}
@Component({
  name: "BaseLayout",
})
class FSXABaseLayout<Data = {}, Meta = {}> extends FSXABaseComponent<
  FSXABaseLayoutProps
> {
  @Prop({ required: true }) data!: BaseLayoutProps["data"];
  @Prop({ required: true }) meta!: BaseLayoutProps["meta"];
  @Prop({ required: true }) content!: BaseLayoutProps["content"];

  renderContentElement(content: BodyContent) {
    switch (content.type) {
      case "Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            meta={content.meta}
            id={content.id}
            previewId={content.id}
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
