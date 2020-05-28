import BaseComponent from "@/components/BaseComponent";
import { Prop, Component } from "vue-property-decorator";
import { BaseSectionProps } from "@/types/page";

@Component({
  name: "BaseSection"
})
class BaseSection<Payload = {}> extends BaseComponent<
  BaseSectionProps<Payload>
> {
  @Prop({ required: true }) payload!: BaseSectionProps<Payload>["payload"];
}
export default BaseSection;
