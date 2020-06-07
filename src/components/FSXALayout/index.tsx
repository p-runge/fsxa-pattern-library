import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import Layouts from "./components";
import { FSXA_INJECT_KEY_LAYOUTS } from "@/constants";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { FSXALayoutProps } from "@/types/components";

@Component({
  name: "FSXALayout",
})
class FSXALayout extends FSXABaseComponent<FSXALayoutProps> {
  @Inject({ from: FSXA_INJECT_KEY_LAYOUTS, default: {} }) layouts!: {};
  @Prop({ required: true })
  data!: FSXALayoutProps["data"];
  @Prop({ required: true }) type!: FSXALayoutProps["type"];
  @Prop({ required: true }) content!: FSXALayoutProps["content"];
  @Prop({ required: true })
  meta!: FSXALayoutProps["meta"];
  @Prop({ required: true }) pageId!: FSXALayoutProps["pageId"];

  get mappedLayouts(): { [key: string]: any } {
    return {
      ...Layouts,
      ...(this.layouts || {}),
    };
  }

  render() {
    const Layout = this.mappedLayouts[this.type];
    if (!Layout) {
      if (this.isDebugMode) {
        console.log(`Could not find layout for given key: ${this.type}`);
        return (
          <div class="w-full p-4 md:p-5 lg:p-10 bg-gray-200 border-gray-400 border-b border-t text-sm">
            <div class="w-full p-5 bg-gray-100 border border-gray-700 rounded-lg">
              <h2 class="text-xl">
                Could not find registered Layout with type <i>{this.type}</i>
              </h2>
              This error message is only displayed in DebugMode. <br />
              You can easily register new layouts by adding them to your
              <pre class="inline bg-gray-900 text-white px-2 py-1 rounded-lg">
                src/fsxa/layouts
              </pre>
              Folder. <br />
              <br />
              The following Payload will be passed to it:
              <pre class="bg-gray-900 text-white p-3 rounded-lg mt-1 whitespace-pre-wrap break-normal">
                <code>
                  {JSON.stringify(
                    {
                      content: this.content,
                      data: this.data,
                      meta: this.meta,
                    },
                    undefined,
                    2,
                  )}
                </code>
              </pre>
            </div>
          </div>
        );
      }
      return null;
    }
    return (
      <div>
        <Layout
          content={this.content}
          data={this.data}
          meta={this.meta}
          pageId={this.pageId}
        />
      </div>
    );
  }
}
export default FSXALayout;
