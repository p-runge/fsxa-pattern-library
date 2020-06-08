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
  backgroundImageSrc: string | null = null;

  async fetchBackgroundImage() {
    // fetch logo
    if (this.payload.pt_picture.src && !this.backgroundImageSrc) {
      this.backgroundImageSrc = await this.fetchImage(
        this.payload.pt_picture.src,
        "ORIGINAL",
      );
    }
  }

  serverPrefetch() {
    return this.fetchBackgroundImage();
  }

  mounted() {
    this.fetchBackgroundImage();
  }

  get navigationData(): NavigationData {
    return this.$store.getters[FSXAGetters.navigationData];
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
        backgroundImage={this.backgroundImageSrc || undefined}
        handleItemClick={item =>
          this.handleRouteChangeRequest({ pageId: item.referenceId })
        }
      />
    );
  }
}
export default FSXAHeaderSection;
