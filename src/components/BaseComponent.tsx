import { FSXABaseComponent } from "fsxa-ui";
import { Component } from "vue-property-decorator";

@Component
class BaseComponent<Props> extends FSXABaseComponent<Props> {}
export default BaseComponent;
