import { BaseSectionProps } from "@/types/components";
import { Prop } from "vue-property-decorator";
import RenderUtils from "./RenderUtils";

class BaseSection<
  Payload = Record<string, any>,
  Meta = Record<string, any>,
  EventsWithOn = {},
  Slots = {
    content?: {};
  }
> extends RenderUtils<BaseSectionProps<Payload, Meta>, EventsWithOn, Slots> {
  /**
   * The payload that is passed to the section
   */
  @Prop({ required: true }) payload!: BaseSectionProps<
    Payload,
    Meta
  >["payload"];
  /**
   * Additional meta data that is provided to the section
   */
  @Prop({ required: true }) meta!: BaseSectionProps<Payload, Meta>["meta"];
  /**
   * The id of the section
   */
  @Prop() id: BaseSectionProps<Payload, Meta>["id"];

  render() {
    return <div>Please provide your own render method in your Section.</div>;
  }
}
export default BaseSection;
