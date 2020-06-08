import Sections from "./components";
import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import BaseComponent from "@/components/FSXABaseComponent";
import { FSXA_INJECT_KEY_SECTIONS } from "@/constants";
import { FSXAContainer } from "fsxa-ui";

export interface FSXASectionProps {
  id: string;
  previewId: string;
  type: string;
  data: any;
  meta: any;
}
@Component({
  name: "FSXASection",
})
class FSXASection extends BaseComponent<FSXASectionProps> {
  @Inject({ from: FSXA_INJECT_KEY_SECTIONS, default: {} }) sections!: {};
  @Prop({ required: true }) id!: FSXASectionProps["id"];
  @Prop({ required: true }) previewId!: FSXASectionProps["previewId"];
  @Prop({ required: true }) type!: FSXASectionProps["type"];
  @Prop({ required: true }) data!: FSXASectionProps["data"];
  @Prop({ required: true }) meta!: FSXASectionProps["meta"];

  get mappedSections(): { [key: string]: any } {
    return {
      ...Sections,
      ...this.sections,
    };
  }

  renderSection() {
    if (!this.data) return null;
    const Component = this.mappedSections[this.type];
    if (!Component) {
      if (this.isDevMode) {
        console.log(`Could not find section for given key: ${this.type}`);
        return (
          <FSXAContainer
            paddingOnly
            class="bg-gray-200 border-b border-t border-gray-400 py-10"
          >
            <div class="w-full text-sm" data-preview-id={this.previewId}>
              <div class="w-full p-5 bg-gray-100 border border-gray-700 rounded-lg">
                <h2 class="text-xl">
                  Could not find registered Section with type <i>{this.type}</i>
                </h2>
                This error message is only displayed in DebugMode. <br />
                You can easily register new sections by adding them to your
                <pre class="inline-block bg-gray-900 text-white px-2 py-1 rounded-lg mx-2">
                  src/fsxa/sections
                </pre>
                Folder. <br />
                <br />
                The following Payload will be passed to it:
                <pre class="bg-gray-900 text-white p-3 rounded-lg mt-1 whitespace-pre-wrap break-normal">
                  <code>
                    {JSON.stringify(
                      {
                        payload: this.data,
                        previewId: this.previewId,
                      },
                      undefined,
                      2,
                    )}
                  </code>
                </pre>
              </div>
            </div>
          </FSXAContainer>
        );
      }
      return null;
    }
    return (
      <div class="relative" data-preview-id={this.previewId}>
        <Component payload={this.data} previewId={this.previewId} />
      </div>
    );
  }

  render() {
    if (!this.data) return null;
    // TODO: Should we even render this kind of information if we are not in preview-mode?
    return this.renderSection();
  }
}
export default FSXASection;
