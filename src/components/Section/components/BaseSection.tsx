import { Prop, Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import { BaseSectionProps } from "@/types/components";
import SectionWrapper from "..";
import { Section, Dataset } from "fsxa-api";

@Component({
  name: "BaseSection",
})
class BaseSection<Payload = {}> extends BaseComponent<
  BaseSectionProps<Payload>
> {
  @Prop({ required: true }) payload!: BaseSectionProps<Payload>["payload"];
  @Prop({ required: true }) content!: BaseSectionProps<Payload>["content"];
  @Prop() id!: BaseSectionProps<Payload>["id"];

  renderChildSection(child: Section | Dataset): JSX.Element {
    const sectionType =
      child.type === "Dataset" ? child.template : child.sectionType;
    return (
      <SectionWrapper
        id={child.id}
        previewId={child.previewId}
        type={sectionType}
        data={child.data}
        content={child.children.map(item => this.renderChildSection(item))}
      />
    );
  }
}
export default BaseSection;
