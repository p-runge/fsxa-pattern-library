import { Component, Prop, Provide } from "vue-property-decorator";
import { Page as APIPage, NavigationData, CAASImageReference } from "fsxa-api";
import { NAVIGATION_DATA_KEY, GLOBAL_SETTINGS_KEY } from "@/store";
import FSXALayout from "@/components/FSXALayout";
import { Fragment } from "vue-fragment";
import { FSXAPageProps, RequestRouteChangeParams } from "@/types/components";
import { FSXANavigation, FSXAFooter, FSXAFooterLink } from "fsxa-ui";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { isClient } from "@/utils";
import { FSXADevInfoTarget, FSXAPage as UIFSXAPage } from "fsxa-ui";

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
  gc_footer_links?: Array<{
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
  gs_logo?: CAASImageReference;
}

@Component({
  name: "FSXAPage",
})
class FSXAPage extends FSXABaseComponent<FSXAPageProps> {
  @Prop() id: FSXAPageProps["id"];
  @Prop() path: FSXAPageProps["path"];
  @Prop() renderNavigation: FSXAPageProps["renderNavigation"];
  @Prop() handleRouteChange!: FSXAPageProps["handleRouteChange"];
  @Prop() renderLayout: FSXAPageProps["renderLayout"];

  serverPrefetch() {
    return this.fetchData();
  }

  @Provide("requestRouteChange")
  requestRouteChange({ pageId, route }: RequestRouteChangeParams): void {
    let nextPage = null;
    if (pageId && this.navigationData)
      nextPage = this.navigationData.idMap[pageId] || null;
    if (route && this.navigationData)
      nextPage =
        this.navigationData.idMap[this.navigationData.pathMap[route]] || null;
    if (nextPage) {
      if (isClient() && this.isEditMode) {
        // eslint-disable-next-line
        const TPP_SNAP = require("fs-tpp-api/snap");
        TPP_SNAP.setPreviewElement(`${nextPage.id}.${this.locale}`);
      }
      this.handleRouteChange(nextPage.path);
    }
  }

  get pageData(): APIPage | null {
    return this.currentPage
      ? this.getStoredItem(this.currentPage.contentReference)
      : null;
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
        const pageId = previewId.split(".")[0];
        const nextPage = this.navigationData?.idMap[pageId];
        if (nextPage) this.requestRouteChange({ route: nextPage.path });
      });
      TPP_SNAP.onRerenderView(() => {
        window.setTimeout(() => this.fetchData(true), 300);
        return false;
      });
    }
    if (this.path === "/" && this.navigationData)
      this.requestRouteChange({ pageId: this.navigationData.indexPage.id });
  }

  updated() {
    this.fetchData();
    if (this.path === "/" && this.navigationData)
      this.requestRouteChange({ pageId: this.navigationData.indexPage.id });
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

  async fetchGlobalSettings() {
    const globalSettings = this.getStoredItem(GLOBAL_SETTINGS_KEY);
    if (!globalSettings) {
      const globalSettings = await this.$fsxaAPI.fetchGCAPages(
        "global_settings",
      );
      if (globalSettings)
        this.setStoredItem(GLOBAL_SETTINGS_KEY, globalSettings[0]);
    }
  }

  async fetchData(force = false) {
    // fetch global_footer
    await Promise.all([this.fetchGlobalSettings(), this.fetchPageData(force)]);
  }

  renderContent() {
    if (!this.pageData) return null;
    const layout = (
      <FSXALayout
        type={this.pageData.layout}
        content={this.pageData.children}
        data={this.pageData.data}
        meta={this.pageData.meta}
        pageId={this.pageData.refId}
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
      });
    return (
      <FSXANavigation
        items={this.navigationData?.structure || []}
        isActiveItem={item => item.id === this.pageData?.refId}
        handleNavClick={({ id }) =>
          this.requestRouteChange({
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
    const links: FSXAFooterLink[] =
      this.globalSettings && this.globalSettings.data.gc_footer_links
        ? this.globalSettings.data.gc_footer_links.map((link: any) => ({
            isActive:
              link.data.lt_link.referenceType === "PageRef" &&
              link.data.lt_link.referenceId === this.currentPage?.id,
            label: link.data.lt_text,
            previewId: link.previewId,
            referenceId: link.data.lt_link.referenceId,
            referenceType:
              link.data.lt_link.referenceType === "PageRef"
                ? "page"
                : "fragment",
          }))
        : [];
    return this.globalSettings ? (
      <FSXAFooter
        copyright={this.globalSettings.data.gc_copyright}
        links={links}
        handleClick={handleLinkClick}
        data-preview-id={this.globalSettings.id}
      >
        {this.globalSettings && this.globalSettings.data.gs_logo ? (
          <img
            src={this.globalSettings.data.gs_logo.resolutions.ORIGINAL.url}
          />
        ) : null}
      </FSXAFooter>
    ) : null;
  }

  render() {
    return (
      <Fragment>
        {this.isDevMode && <FSXADevInfoTarget />}
        {this.renderLayout ? (
          this.renderLayout(this.renderContent())
        ) : (
          <UIFSXAPage
            renderFooter={this.renderFooter}
            renderNavigation={this.renderNav}
          >
            {this.renderContent()}
          </UIFSXAPage>
        )}
      </Fragment>
    );
  }
}
export default FSXAPage;
