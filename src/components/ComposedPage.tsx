import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "./BaseComponent";
import { ComposedPageProps } from "@/types/page";
import Page from "./Page";
import { Page as APIPage } from "fsxa-api/src/caas/types";
import ComposedNavigation from "./ComposedNavigation";
import TPP_SNAP from "fs-tpp-api/snap";

@Component({
  name: "ComposedPage"
})
class ComposedPage extends BaseComponent<ComposedPageProps> {
  @Prop({ required: true }) id!: ComposedPageProps["id"];
  @Prop() renderNavigation: ComposedPageProps["renderNavigation"];
  // TODO: In PreviewMode: Register with tpp-snap and reload page-data or even better --> only replace changed sections content

  serverPrefetch() {
    return this.fetchData();
  }

  get pageData(): APIPage | null {
    return this.getStoredItem(this.key);
  }

  get key() {
    return `${this.id}.${this.locale}`;
  }

  mounted() {
    this.fetchData();
    if (this.isEditMode) {
      TPP_SNAP.onRequestPreviewElement((previewId: string) => {
        console.log("Reqesting preview Element", previewId);
      });
    }
    // initialize TPP-SNAP if we are in preview mode
  }

  updated() {
    this.fetchData();
  }

  async fetchData(force = false) {
    const storedItem = this.getStoredItem(this.key);
    if (!storedItem || force) {
      const response = await this.$fsxaAPI.fetchPage(this.id);
      this.setStoredItem(this.key, response);
    }
  }

  render() {
    if (!this.pageData) return null;
    return (
      <Page
        id={this.id}
        renderNavigation={
          this.renderNavigation ||
          (() => <ComposedNavigation handleNavClick={console.log} />)
        }
        layoutType={this.pageData.layout}
        previewId={this.pageData.previewId}
        data={this.pageData.data}
        meta={this.pageData.meta}
        body={this.pageData.children}
      />
    );
  }
}
export default ComposedPage;
