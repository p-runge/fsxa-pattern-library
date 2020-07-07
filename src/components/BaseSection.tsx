import FSXABaseComponent from "./FSXABaseComponent";
import Component from "vue-class-component";

// eslint-disable-next-line
export interface BaseSectionProps<Payload> {}
@Component
class BaseSection<Payload> extends FSXABaseComponent<
  BaseSectionProps<Payload>
> {}
export default BaseSection;
