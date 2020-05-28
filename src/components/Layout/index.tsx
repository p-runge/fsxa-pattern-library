import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import Layouts from "./components";
import { FSXA_INJECT_KEY_LAYOUTS } from "@/constants";
import { Body } from "fsxa-api";

export interface LayoutProps {
  type: string;
  content: Body[];
  data: any;
  meta: any;
}
@Component({
  name: "Layout"
})
class Layout extends BaseComponent<LayoutProps> {
  @Inject({ from: FSXA_INJECT_KEY_LAYOUTS, default: {} }) layouts!: {};
  @Prop({ required: true })
  data!: LayoutProps["data"];
  @Prop({ required: true }) type!: LayoutProps["type"];
  @Prop({ required: true }) content!: LayoutProps["content"];
  @Prop({ required: true })
  meta!: LayoutProps["meta"];

  get mappedLayouts(): { [key: string]: any } {
    return {
      ...Layouts,
      ...(this.layouts || {})
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
              </pre>{" "}
              Folder. <br />
              <br />
              The following Payload will be passed to it:
              <pre class="bg-gray-900 text-white p-3 rounded-lg mt-1 whitespace-pre-wrap break-normal">
                <code>
                  {JSON.stringify(
                    {
                      content: this.content,
                      data: this.data,
                      meta: this.meta
                    },
                    undefined,
                    2
                  )}
                </code>
              </pre>
            </div>
          </div>
        );
      }
      return null;
    }
    return <Layout content={this.content} data={this.data} meta={this.meta} />;
  }
}
export default Layout;
