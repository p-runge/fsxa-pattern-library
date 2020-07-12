import { Prop, Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import { BaseSectionProps } from "@/types/components";

@Component({
  name: "BaseSection",
})
class BaseSection<Payload = {}> extends BaseComponent<
  BaseSectionProps<Payload>
> {
  @Prop({ required: true }) payload!: BaseSectionProps<Payload>["payload"];
}
export default BaseSection;
