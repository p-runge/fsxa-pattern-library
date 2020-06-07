import Component from "vue-class-component";
import { Sections } from "fsxa-ui";
import FSXABaseSection from "./FSXABaseSection";
import { NavigationData } from "fsxa-api";
import { FSXAGetters } from "@/store";

export interface Payload {
  pt_text: string;
  pt_picture: {
    src: string;
  };
  pageId: string;
}
@Component({
  name: "FSXAHeaderSection",
})
class FSXAHeaderSection extends FSXABaseSection<Payload> {
  serverPrefetch() {
    return this.fetchBackgroundImage();
  }

  mounted() {
    this.fetchBackgroundImage();
  }

  get navigationData(): NavigationData {
    return this.$store.getters[FSXAGetters.navigationData];
  }

  async fetchBackgroundImage() {
    return this.fetchImage(this.payload.pt_picture.src, "ORIGINAL");
  }

  get backgroundImage(): string | null {
    return this.getImage(this.payload.pt_picture.src, "ORIGINAL");
  }

  render() {
    const currentPage = this.navigationData.idMap[this.payload.pageId];
    return (
      <Sections.HeaderSection
        title={this.payload.pt_text}
        breadcrumbs={
          currentPage
            ? currentPage.parentIds.map(parentId => ({
                label: this.navigationData.idMap[parentId].label || "",
                referenceId: parentId,
                referenceType: "PageRef",
              }))
            : []
        }
        backgroundImage={this.backgroundImage || undefined}
        handleItemClick={item =>
          this.handleRouteChangeRequest({ pageId: item.referenceId })
        }
      />
    );
  }
}
export default FSXAHeaderSection;
