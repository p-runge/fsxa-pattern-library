import {
  Component,
  InjectReactive,
  Prop,
  Provide,
} from "vue-property-decorator";
import BaseComponent from "./BaseComponent";
import {
  AppComponents,
  BaseRichTextElementProps,
} from "./../../types/components";
import { CreateElement, RenderContext } from "vue";
import { FSXA_INJECT_KEY_COMPONENTS } from "./../../constants";
import MissingRichTextComponent from "../RichText/MissingRichTextComponent";

export const ContentHelper = {
  functional: true,
  inject: {
    renderContent: {
      default: () => null,
    },
  },
  render: (h: CreateElement, ctx: RenderContext) => {
    const content = ctx.injections.renderContent();
    if (typeof content === "string") {
      return h("span", { domProps: { innerHTML: content } });
    }
    return content;
  },
};

@Component({
  name: "BaseRichTextElement",
  components: {
    "render-content": ContentHelper,
  },
})
class BaseRichTextElement<Data = Record<string, any>> extends BaseComponent<
  BaseRichTextElementProps<Data>
> {
  @Prop({ required: true }) data!: BaseRichTextElementProps<Data>["data"];
  @Prop({ required: true }) content!: BaseRichTextElementProps<Data>["content"];

  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  get elements(): Record<string, any> {
    return this.components.richtext || {};
  }

  @Provide("renderContent")
  renderContent() {
    if (typeof this.content === "string") return this.content;
    return this.content.map(element => {
      if (this.elements[element.type]) {
        const Element = this.elements[element.type];
        return <Element content={element.content} data={element.data} />;
      }
      return <MissingRichTextComponent element={element} />;
    });
  }

  render() {
    return (
      <div>
        Please provide your own render method in your RichText-Component.
      </div>
    );
  }
}
export default BaseRichTextElement;
