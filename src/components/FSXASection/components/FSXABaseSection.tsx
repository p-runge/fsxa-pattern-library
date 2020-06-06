import { Prop, Component } from "vue-property-decorator";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { FSXABaseSectionProps } from "@/types/components";

@Component({
  name: "FSXABaseSection",
})
class FSXABaseSection<Payload = {}> extends FSXABaseComponent<
  FSXABaseSectionProps<Payload>
> {
  @Prop({ required: true }) payload!: FSXABaseSectionProps<Payload>["payload"];
}
export default FSXABaseSection;
