import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import {
  FSXAGetters,
  FSXAActions,
  FSXAAppState,
  CurrentPage,
  FSXAAppError,
} from "@/store";
import { Fragment } from "vue-fragment";
import {
  RequestRouteChangeParams,
  PageProps,
  AppLocale,
} from "@/types/components";
import {
  Navigation,
  Footer,
  FooterLink,
  DevInfoTarget,
  Page as UIPage,
  Loader,
  Dropdown,
  Option,
  DevInfo,
} from "fsxa-ui";
import BaseComponent from "@/components/BaseComponent";
import { NavigationData } from "fsxa-api";
import { isClient } from "@/utils";
import Layout from "@/components/Layout";

const getDropdownOptions = (locales: AppLocale[] = []): Option[] => {
  return locales.map(locale => {
    if (typeof locale === "string")
      return {
        key: locale,
        label: locale,
      };
    else {
      return {
        key: locale.value,
        label: locale.label,
      };
    }
  });
};

@Component({
  name: "Page",
})
class Page extends BaseComponent<PageProps> {
  @Prop() id: PageProps["id"];
  @Prop() currentPath: PageProps["currentPath"];
  @Prop() renderNavigation: PageProps["renderNavigation"];
  @Prop() handleRouteChange!: PageProps["handleRouteChange"];
  @Prop() renderLayout: PageProps["renderLayout"];
  @Prop() renderLoader: PageProps["renderLoader"];
  @Prop({ required: true }) defaultLocale!: PageProps["defaultLocale"];
  @Prop({ required: true }) locales!: PageProps["locales"];

  serverPrefetch() {
    return this.initialize({
      locale: this.defaultLocale,
      path: this.currentPath,
      isClient: false,
    });
  }

  @Watch("currentPath", { immediate: true })
  onPathChange(nextPath: string) {
    this.$store.dispatch(FSXAActions.fetchPage, {
      path: nextPath,
      isClient: true,
    });
  }

  mounted() {
    // we will initialize the app if this was not happening on the server
    if (this.appState === FSXAAppState.not_initialized) {
      this.initialize({
        locale: this.locale || this.defaultLocale,
        path: this.currentPath,
        isClient: true,
      });
    }
    if (this.isEditMode) {
      // eslint-disable-next-line
      const TPP_SNAP = require("fs-tpp-api/snap");
      TPP_SNAP.onRequestPreviewElement((previewId: string) => {
        const pageId = previewId.split(".")[0];
        const nextPage = this.navigationData?.idMap[pageId];
        if (nextPage) this.requestRouteChange({ route: nextPage.path });
      });
      TPP_SNAP.onRerenderView(() => {
        window.setTimeout(
          () =>
            this.initialize({
              isClient: true,
              locale: this.locale,
              path: this.currentPath,
            }),
          300,
        );
        return false;
      });
    }
  }

  initialize({
    locale,
    path,
    pageId,
    isClient,
  }: {
    locale: string;
    path?: string;
    pageId?: string;
    isClient: boolean;
  }) {
    return this.$store.dispatch(FSXAActions.initialize, {
      locale,
      path,
      pageId,
      isClient,
    });
  }

  get appState(): FSXAAppState {
    return this.$store.getters[FSXAGetters.appState];
  }

  get appError(): FSXAAppError | null {
    return this.$store.getters[FSXAGetters.error];
  }

  get navigationData(): NavigationData | null {
    return this.$store.getters[FSXAGetters.navigationData];
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

  async requestLocaleChange(locale: string) {
    const pageId = this.currentPage?.id || null;
    if (locale !== this.locale && pageId) {
      const nextPath = await this.initialize({
        locale,
        pageId,
        isClient: true,
      });
      if (nextPath) {
        this.handleRouteChange(nextPath);
      }
    }
  }

  get currentPage(): CurrentPage | null {
    return this.$store.getters[FSXAGetters.currentPage];
  }

  get settings(): any {
    return this.$store.state.fsxa.settings;
  }

  get locale() {
    return this.$store.getters[FSXAGetters.locale] || this.defaultLocale;
  }

  renderContent() {
    if (!this.currentPage || !this.currentPage.content) return null;
    const layout = (
      <Layout
        type={this.currentPage.content.layout}
        content={this.currentPage.content.children}
        data={this.currentPage.content.data}
        meta={this.currentPage.content.meta}
        pageId={this.currentPage.content.refId}
      />
    );
    return this.isEditMode ? (
      <div data-preview-id={this.currentPage.content.previewId}>{layout}</div>
    ) : (
      <Fragment>{layout}</Fragment>
    );
  }

  renderNav() {
    if (this.renderNavigation)
      return this.renderNavigation({
        locale: this.defaultLocale,
        locales: this.locales || [],
        handleLocaleChange: this.requestLocaleChange,
        activePageId: this.currentPage?.id || "",
        activeSeoRoute: this.currentPath || "",
      });
    return (
      <div class="flex flex-row items-center justify-center">
        <Navigation
          items={this.navigationData?.structure || []}
          isActiveItem={item =>
            Boolean(
              this.currentPage &&
                this.currentPage.content &&
                item.id === this.currentPage.content.refId,
            )
          }
          handleNavClick={({ id }) =>
            this.requestRouteChange({
              pageId: id,
            })
          }
        />
        {this.locales ? (
          <Dropdown
            class="ml-10"
            value={this.locale}
            options={getDropdownOptions(this.locales)}
            handleChange={newLocale => this.requestLocaleChange(newLocale.key)}
          >
            <i class="fas fa-globe-europe" />
          </Dropdown>
        ) : null}
      </div>
    );
  }

  renderFooter() {
    const handleLinkClick = (link: FooterLink) => {
      const nextPage = this.navigationData?.idMap[link.referenceId];
      if (nextPage) this.handleRouteChange(nextPage?.path);
    };
    const links: FooterLink[] =
      this.settings && this.settings.data.gc_footer_links
        ? this.settings.data.gc_footer_links.map((link: any) => ({
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
    return this.settings ? (
      <Footer
        copyright={this.settings.data.gc_copyright}
        links={links}
        handleClick={handleLinkClick}
        data-preview-id={this.settings.id}
      >
        {this.settings && this.settings.data.gs_logo ? (
          <img src={this.settings.data.gs_logo.resolutions.ORIGINAL.url} />
        ) : null}
      </Footer>
    ) : null;
  }

  render() {
    const content =
      this.appState === FSXAAppState.fetching ? (
        <Loader renderLoader={this.renderLoader} />
      ) : (
        this.renderContent()
      );
    if (this.renderLayout) {
      return (
        <Fragment>
          {this.isDevMode && <DevInfoTarget />}
          {this.renderLayout({
            appState: this.appState,
            appError: this.appError,
            content,
            handleLocaleChange: this.requestLocaleChange,
            locale: this.locale || this.defaultLocale,
            locales: this.locales || [],
          })}
        </Fragment>
      );
    }
    if (this.appState === FSXAAppState.initializing) return null;
    if (this.appState === FSXAAppState.error) {
      return (
        <div class="w-full h-full">
          <DevInfo
            class="h-full"
            devModeHint="This error message is always displayed"
            headline={
              this.appError ? this.appError.message : "Unknown error occured"
            }
          >
            {this.appError?.description}
          </DevInfo>
        </div>
      );
    }
    return (
      <Fragment>
        {this.isDevMode && <DevInfoTarget />}
        <UIPage
          renderFooter={this.renderFooter}
          renderNavigation={this.renderNav}
        >
          {content}
        </UIPage>
      </Fragment>
    );
  }
}
export default Page;
