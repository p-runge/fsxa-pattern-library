import { Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import { Body } from "fsxa-api";

export interface BaseLayoutProps<Data = {}, Meta = {}> {
  content: Body[];
  data: Data;
  meta: Meta;
}
abstract class BaseLayout<Data = {}, Meta = {}> extends BaseComponent<
  BaseLayoutProps
> {
  @Prop({ required: true }) data!: BaseLayoutProps["data"];
  @Prop({ required: true }) meta!: BaseLayoutProps["meta"];
  @Prop({ required: true }) content!: BaseLayoutProps["content"];
}
export default BaseLayout;
