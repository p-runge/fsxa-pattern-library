import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";
import { BaseRichTextElementProps } from "@/types/components";

@Component({
  name: "BaseRichTextElement",
})
class BaseRichTextElement<Data = Record<string, any>> extends BaseComponent<
  BaseRichTextElementProps<Data>
> {
  @Prop({ required: true }) data!: BaseRichTextElementProps<Data>["data"];
  @Prop({ required: true }) content!: BaseRichTextElementProps<Data>["content"];

  render() {
    return (
      <div>
        Please provide your own render method in your RichText-Component.
      </div>
    );
  }
}
export default BaseRichTextElement;
