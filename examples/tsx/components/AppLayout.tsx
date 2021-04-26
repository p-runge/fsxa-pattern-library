import { Component } from "vue-property-decorator";
import {
  FSXABaseAppLayout,
  FSXALink,
  FSXAAppState,
} from "fsxa-pattern-library";

@Component({
  name: "AppLayout",
})
class AppLayout extends FSXABaseAppLayout {
  render() {
    if (this.appState !== FSXAAppState.ready) return <div />;
    return (
      <div>
        <div class="pl-bg-gray-200">
          <div class="pl-w-full pl-flex pl-items-center pl-justify-center pl-px-4 md:pl-px-6 lg:pl-px-10 pl-py-3">
            <div class="pl-flex-shrink-0 pl-font-bold">TSX App</div>
            <div class="pl-flex-1 pl-text-right">
              {this.navigationData && (
                <ul class="pl-nline-block">
                  {this.navigationData.structure.map(item => (
                    <li class="pl-inline-block pl-px-2 pl-text-sm">
                      <FSXALink
                        class="hover:pl-underline"
                        activeClass="pl-underline"
                        pageId={item.id}
                      >
                        {this.navigationData!.idMap[item.id].label}
                      </FSXALink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div class="pl-flex-shrink-0 pl-ml-3 pl-text-xs pl-space-x-2">
              <FSXALink
                class="pl-inline-block hover:pl-underline"
                activeClass="pl-underline"
                pageId={this.currentPage?.item.id}
                datasetId={this.currentPage?.datasetId}
                nextLocale="en_GB"
              >
                en_GB
              </FSXALink>
              <FSXALink
                class="pl-inline-block hover:pl-underline"
                activeClass="pl-underline"
                pageId={this.currentPage?.item.id}
                datasetId={this.currentPage?.datasetId}
                nextLocale="de_DE"
              >
                de_DE
              </FSXALink>
            </div>
          </div>
        </div>
        {this.$slots.default}
      </div>
    );
  }
}
export default AppLayout;
