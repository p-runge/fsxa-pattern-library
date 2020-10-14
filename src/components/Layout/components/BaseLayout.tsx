import { Prop, Component } from "vue-property-decorator";
import { PageBodyContent } from "fsxa-api";
import Section from "@/components/Section";
import BaseComponent from "@/components/BaseComponent";
import { BaseLayoutProps } from "@/types/components";

@Component({
  name: "BaseLayout",
})
class BaseLayout<Data = {}, Meta = {}> extends BaseComponent<
  BaseLayoutProps<Data, Meta>
> {
  @Prop({ required: true }) pageId!: BaseLayoutProps<Data, Meta>["pageId"];
  @Prop({ required: true }) data!: BaseLayoutProps<Data, Meta>["data"];
  @Prop({ required: true }) meta!: BaseLayoutProps<Data, Meta>["meta"];
  @Prop({ required: true }) content!: BaseLayoutProps<Data, Meta>["content"];

  renderContentElement(content: PageBodyContent) {
    switch (content.type) {
      case "Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            id={content.id}
            previewId={content.previewId}
            content={content.children.map(child =>
              this.renderContentElement(child),
            )}
          />
        );
      case "Content2Section":
        return (
          <Section
            type={content.sectionType}
            data={content.data}
            content={content.children.map(child =>
              this.renderContentElement(child),
            )}
          />
        );
      case "Dataset":
        return (
          <Section
            type={content.template}
            data={content.data}
            id={content.id}
            previewId={content.previewId}
            content={content.children.map(child =>
              this.renderContentElement(child),
            )}
          />
        );
      default:
        return null;
    }
  }

  renderContentElements(index: number) {
    return this.content[index].children.map(this.renderContentElement);
  }
}
export default BaseLayout;
