import Component from "vue-class-component";
import { Component as TsxComponent } from "vue-tsx-support";
import { Provide, Watch } from "vue-property-decorator";
import { FSXA_INJECT_KEY_SET_PORTAL_CONTENT } from "./../../constants";

@Component({
  name: "PortalProvider",
})
class PortalProvider extends TsxComponent<{}> {
  portalContent: any | null = null;

  @Watch("portalContent")
  onPortalContentChange(portalContent: any) {
    if (portalContent) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }

  @Provide(FSXA_INJECT_KEY_SET_PORTAL_CONTENT)
  setPortalContent(portalContent: any | null) {
    this.portalContent = portalContent;
  }

  render() {
    return (
      <div>
        {this.$slots.default}
        {this.portalContent && (
          <div class="pl-fixed pl-w-full pl-h-screen pl-top-0 pl-left-0 pl-flex pl-items-start pl-justify-center pl-z-50">
            <div
              class="pl-absolute pl-top-0 pl-left-0 pl-w-full pl-h-full pl-bg-gray-800 pl-bg-opacity-50 pl-z-0"
              onClick={event => {
                event.preventDefault();
                this.setPortalContent(null);
              }}
            />
            <div class="pl-relative pl-h-screen pl-w-full pl-flex pl-items-center pl-justify-center pl-pointer-events-none">
              {this.portalContent}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default PortalProvider;
