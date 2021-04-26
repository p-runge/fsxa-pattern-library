import { LinkProps } from "./../types/components";
import { findNavigationItemInNavigationData } from "./../utils/getters";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";

@Component({
  name: "Link",
})
class Link extends BaseComponent<LinkProps> {
  @Prop() pageId: LinkProps["pageId"];
  @Prop() datasetId: LinkProps["datasetId"];
  @Prop() seoRoute: LinkProps["seoRoute"];
  @Prop() nextLocale: LinkProps["nextLocale"];
  @Prop() activeClass: LinkProps["activeClass"];

  serverPrefetch() {
    return this.fetchLinkData();
  }

  mounted() {
    this.fetchLinkData();
  }

  async fetchLinkData() {
    if (this.datasetId && !this.fetchedRoute) {
      const dataset = await this.fsxaApi.fetchElement(
        this.datasetId,
        this.nextLocale || this.locale,
      );
      this.setStoredItem(
        `${this.datasetId}-${this.nextLocale || this.locale}-route`,
        dataset.route,
      );
    }
  }

  get fetchedRoute(): string | null {
    if (!this.datasetId) return null;
    return (
      this.getStoredItem(
        `${this.datasetId}-${this.nextLocale || this.locale}-route`,
      ) || null
    );
  }

  get route() {
    if (this.seoRoute) return this.seoRoute;
    if (this.fetchedRoute) return this.fetchedRoute;
    const navigationItem = findNavigationItemInNavigationData(this.$store, {
      locale: this.nextLocale || this.locale,
      pageId: this.pageId,
      seoRoute: this.seoRoute,
    });
    if (navigationItem && !navigationItem.seoRouteRegex) {
      // if the locale is different, we will make two requests to the caas

      return navigationItem.seoRoute;
    }
    return "#";
  }

  get isActive() {
    return (
      (!this.pageId || this.pageId === this.currentPage?.item.id) &&
      (!this.nextLocale || this.nextLocale === this.currentPage?.locale)
    );
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
    this.triggerRouteChange(
      this.route !== "#"
        ? {
            route: this.route,
          }
        : {
            pageId: this.pageId,
            locale: this.nextLocale || this.locale,
          },
    );
  }

  render() {
    return (
      <a
        href={this.route}
        key={this.datasetId || this.pageId}
        class={this.isActive ? this.activeClass : undefined}
        onClick={this.handleClick}
      >
        {this.$slots.default}
      </a>
    );
  }
}
export default Link;
