import { Component, Prop, Provide } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";
import { BaseRichTextElementProps } from "@/types/components";
import RichText from "./../RichText";
import { CreateElement, RenderContext } from "vue";

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

  @Provide("renderContent")
  renderContent() {
    if (typeof this.content === "string") return this.content;
    return this.content.map(element => <RichText content={element} />);
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
