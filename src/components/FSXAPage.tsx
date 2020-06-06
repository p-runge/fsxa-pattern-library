import { Component, Prop } from "vue-property-decorator";
import { PageProps } from "@/types/page";
import { Page as APIPage, NavigationData, GCAPage } from "fsxa-api";
import { NAVIGATION_DATA_KEY } from "@/store";
import FSXALayout from "@/components/FSXALayout";
import { Fragment } from "vue-fragment";
import { FSXAPageProps } from "@/types/components";
import {
  FSXANavigation,
  FSXAFooter,
  FSXAFooterLink,
  FSXAContainer,
} from "fsxa-ui";
import FSXABaseComponent from "@/components/FSXABaseComponent";

const STORAGE_KEY_GLOBAL_FOOTER = "FSXAPage.GLOBAL_FOOTER";
const STORAGE_KEY_GLOBAL_SETTINGS = "FSXAPage.GLOBAL_SETTINGS";

const getCurrentPage = (
  navigationData: NavigationData,
  id?: string,
  path?: string,
) => {
  if (path) return navigationData.idMap[navigationData.pathMap[path]] || null;
  if (id) return navigationData.idMap[id] || null;
  return null;
};

interface GlobalSettings {
  gc_copyright: string;
  gc_footer_links: Array<{
    identifier: string;
    previewId: string;
    data: {
      lt_link: {
        referenceId: string;
        referenceType: string;
      };
      lt_text: string;
    };
  }>;
  gs_logo: {
    previewId: string;
    src: string;
  };
}

@Component({
  name: "FSXAPage",
})
class FSXAPage extends FSXABaseComponent<FSXAPageProps> {
  @Prop() id: PageProps["id"];
  @Prop() path: PageProps["path"];
  @Prop() renderNavigation: PageProps["renderNavigation"];
  @Prop() handleRouteChange!: PageProps["handleRouteChange"];

  logoSrc: string | null = null;

  // TODO: In PreviewMode: Register with tpp-snap and reload page-data or even better --> only replace changed sections content

  serverPrefetch() {
    return this.fetchData();
  }

  get pageData(): APIPage | null {
    return this.currentPage
      ? this.getStoredItem(this.currentPage.contentReference)
      : null;
  }

  get navigationData(): NavigationData | null {
    return this.getStoredItem(NAVIGATION_DATA_KEY);
  }

  get currentPage() {
    const navigationData = this.navigationData;
    if (!navigationData) return null;
    return getCurrentPage(navigationData, this.id, this.path);
  }

  mounted() {
    this.fetchData();
    if (this.isEditMode) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      TPP_SNAP.onRequestPreviewElement((previewId: string) => {
        console.log("Reqesting preview Element", previewId);
      });
    }
    // initialize TPP-SNAP if we are in preview mode
  }

  updated() {
    this.fetchData();
  }

  async fetchPageData(force = false) {
    let navigationData: NavigationData | null = this.getStoredItem(
      NAVIGATION_DATA_KEY,
    );
    if (!navigationData) {
      navigationData = await this.$fsxaAPI.fetchNavigation();
      this.setStoredItem(NAVIGATION_DATA_KEY, navigationData);
    }
    if (!this.id && !this.path)
      throw new Error("You either have to specify id or path");
    const currentItem = getCurrentPage(navigationData, this.id, this.path);
    if (!currentItem) return;
    const storedItem = this.getStoredItem(currentItem.contentReference);
    if (!storedItem || force) {
      this.setStoredItem(currentItem.contentReference, null);
      const response = await this.$fsxaAPI.fetchPage(
        currentItem.contentReference,
      );
      this.setStoredItem(currentItem.contentReference, response);
    }
  }

  async fetchGlobalSettings(force = false) {
    const globalSettings = this.getStoredItem(STORAGE_KEY_GLOBAL_SETTINGS);
    if (!globalSettings) {
      const globalSettings = await this.$fsxaAPI.fetchGCAPages(
        "global_settings",
      );
      if (globalSettings && !this.logoSrc) {
        const url = (globalSettings[0] as GCAPage<{ gs_logo: { src: string } }>)
          .data.gs_logo.src;
        const result = await this.$fsxaAPI.fetchImageBlob(url, "ORIGINAL");
        this.logoSrc = URL.createObjectURL(result);
      }
      if (globalSettings)
        this.setStoredItem(STORAGE_KEY_GLOBAL_SETTINGS, globalSettings[0]);
    }
  }

  get globalSettings(): GCAPage<GlobalSettings> | null {
    return this.getStoredItem(STORAGE_KEY_GLOBAL_SETTINGS) || null;
  }

  async fetchData(force = false) {
    // fetch global_footer
    await Promise.all([
      this.fetchGlobalSettings(force),
      this.fetchPageData(force),
    ]);
  }

  handleRouteChangeRequest({
    pageId,
    seoRoute,
  }: {
    pageId?: string;
    seoRoute?: string;
  }) {
    let nextPage = null;
    if (pageId && this.navigationData)
      nextPage = this.navigationData.idMap[pageId] || null;
    if (seoRoute && this.navigationData)
      nextPage =
        this.navigationData.idMap[this.navigationData.pathMap[seoRoute]] ||
        null;
    if (nextPage) this.handleRouteChange(nextPage.path);
  }

  renderContent() {
    if (!this.pageData) return null;
    const layout = (
      <FSXALayout
        type={this.pageData.layout}
        content={this.pageData.children}
        data={this.pageData.data}
        meta={this.pageData.meta}
      />
    );
    return this.isEditMode ? (
      <div data-preview-id={this.pageData.previewId}>{layout}</div>
    ) : (
      <Fragment>{layout}</Fragment>
    );
  }

  renderNav() {
    if (this.renderNavigation)
      return this.renderNavigation({
        activePageId: this.currentPage?.id || "",
        activeSeoRoute: this.path || "",
        handleRouteChange: this.handleRouteChangeRequest,
      });
    return (
      <FSXANavigation
        items={this.navigationData?.structure || []}
        isActiveItem={item => item.id === this.pageData?.refId}
        handleNavClick={({ id }) =>
          this.handleRouteChangeRequest({
            pageId: id,
          })
        }
      />
    );
  }

  renderFooter() {
    const handleLinkClick = (link: FSXAFooterLink) => {
      const nextPage = this.navigationData?.idMap[link.referenceId];
      if (nextPage) this.handleRouteChange(nextPage?.path);
    };
    const links: FSXAFooterLink[] = this.globalSettings
      ? this.globalSettings.data.gc_footer_links.map(link => ({
          isActive:
            link.data.lt_link.referenceType === "PageRef" &&
            link.data.lt_link.referenceId === this.currentPage?.id,
          label: link.data.lt_text,
          previewId: link.previewId,
          referenceId: link.data.lt_link.referenceId,
          referenceType:
            link.data.lt_link.referenceType === "PageRef" ? "page" : "fragment",
        }))
      : [];
    return this.globalSettings ? (
      <FSXAFooter
        copyright={this.globalSettings.data.gc_copyright}
        links={links}
        handleClick={handleLinkClick}
      >
        {this.logoSrc ? <img src={this.logoSrc} /> : null}
      </FSXAFooter>
    ) : null;
  }

  render() {
    return (
      <div class={`w-full ${this.globalSettings ? "pb-64" : ""} relative`}>
        {this.renderFooter()}
        <div class="w-full relative">
          <div class="fixed top-0 left-0 w-full z-10 bg-white">
            <FSXAContainer paddingOnly class="flex items-center">
              <div class="flex-1">
                {this.logoSrc ? (
                  <img
                    src={this.logoSrc}
                    data-preview-id={
                      this.globalSettings?.data.gs_logo.previewId
                    }
                  />
                ) : null}
              </div>
              <div class="flex-grow-0 pr-20">{this.renderNav()}</div>
            </FSXAContainer>
          </div>
        </div>
        <div class="w-full mt-24 bg-white relative">{this.renderContent()}</div>
      </div>
    );
  }
}
export default FSXAPage;
