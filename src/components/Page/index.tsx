import { Prop, Component } from "vue-property-decorator";
import Layout from "@/components/Layout";
import { Fragment } from "vue-fragment";
import BaseComponent from "@/components/BaseComponent";
import { RenderNavigationHook } from "@/types/page";
import { Body } from "fsxa-api";

export interface PageProps {
  id: string;
  previewId: string;
  layoutType: string;
  body: Body[];
  data: any;
  meta: any;
  renderNavigation: RenderNavigationHook;
}
@Component({
  name: "Page"
})
class Page extends BaseComponent<PageProps> {
  @Prop({ required: true }) id!: PageProps["id"];
  @Prop({ required: true }) previewId!: PageProps["previewId"];
  @Prop({ required: true }) layoutType!: PageProps["layoutType"];
  @Prop({ required: true }) body!: PageProps["body"];
  @Prop({ required: false, default: {} }) data!: PageProps["data"];
  @Prop({ required: false, default: {} }) meta!: PageProps["meta"];
  @Prop({ required: true }) renderNavigation!: PageProps["renderNavigation"];

  render() {
    const layout = (
      <Layout
        type={this.layoutType}
        content={this.body}
        data={this.data}
        meta={this.meta}
      />
    );
    return (
      <div class="w-full">
        <div class="w-full relative">
          <div class="fixed top-0 left-0 w-full z-10">
            <div class="w-full bg-white px-12">
              {this.renderNavigation(this.data.id)}
            </div>
          </div>
        </div>
        <div class="w-full mt-24">
          {this.isEditMode ? (
            <div data-preview-id={this.previewId}>{layout}</div>
          ) : (
            <Fragment>{layout}</Fragment>
          )}
        </div>
      </div>
    );
    return;
  }
}
export default Page;
