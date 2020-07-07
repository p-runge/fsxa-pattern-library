import Component from "vue-class-component";
import { Sections } from "fsxa-ui";
import FSXABaseSection from "./FSXABaseSection";
import { NavigationData, CAASImageReference } from "fsxa-api";
import { FSXAGetters } from "@/store";

export interface Payload {
  pt_text: string;
  pt_picture?: CAASImageReference;
  pageId: string;
}
@Component({
  name: "FSXAHeaderSection",
})
class FSXAHeaderSection extends FSXABaseSection<Payload> {
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
        backgroundImage={
          this.payload.pt_picture?.resolutions.ORIGINAL.url || undefined
        }
        handleItemClick={item =>
          this.handleRouteChangeRequest({ pageId: item.referenceId })
        }
      />
    );
  }
}
export default FSXAHeaderSection;
