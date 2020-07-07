import FSXABaseComponent from "./FSXABaseComponent";
import Component from "vue-class-component";

// eslint-disable-next-line
export interface BaseLayoutProps {}
@Component
class BaseLayout<Props> extends FSXABaseComponent<BaseLayoutProps & Props> {}
export default BaseLayout;
