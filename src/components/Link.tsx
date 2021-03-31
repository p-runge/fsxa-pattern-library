import { LinkProps } from "@/types/components";
import { findNavigationItemInNavigationData } from "@/utils/getters";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";

@Component({
  name: "Link",
})
class Link extends BaseComponent<LinkProps> {
  @Prop() pageId: LinkProps["pageId"];
  @Prop() seoRoute: LinkProps["seoRoute"];
  @Prop() nextLocale: LinkProps["nextLocale"];
  @Prop() activeClass: LinkProps["activeClass"];

  get route() {
    if (this.seoRoute) return this.seoRoute;
    const navigationItem = findNavigationItemInNavigationData(this.$store, {
      locale: this.nextLocale || this.locale,
      pageId: this.pageId,
      seoRoute: this.seoRoute,
    });
    if (navigationItem) return navigationItem.seoRoute;
    return "#";
  }

  get isActive() {
    return this.currentPage?.seoRoute === this.route;
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
        key={this.locale}
        class={this.isActive ? this.activeClass : undefined}
        onClick={this.handleClick}
      >
        {this.$slots.default}
      </a>
    );
  }
}
export default Link;
