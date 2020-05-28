import Sections from "./components";
import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import { FSXA_INJECT_KEY_SECTIONS } from "@/constants";

export interface SectionProps {
  id: string;
  previewId: string;
  type: string;
  data: any;
  meta: any;
}
@Component({
  name: "Section"
})
class Section extends BaseComponent<SectionProps> {
  @Inject({ from: FSXA_INJECT_KEY_SECTIONS, default: {} }) sections!: {};
  @Prop({ required: true }) id!: SectionProps["id"];
  @Prop({ required: true }) previewId!: SectionProps["previewId"];
  @Prop({ required: true }) type!: SectionProps["type"];
  @Prop({ required: true }) data!: SectionProps["data"];
  @Prop({ required: true }) meta!: SectionProps["meta"];

  get mappedSections(): { [key: string]: any } {
    return {
      ...Sections,
      ...this.sections
    };
  }

  renderSection() {
    if (!this.data) return null;
    const Component = this.mappedSections[this.type];
    if (!Component) {
      if (this.isDebugMode) {
        console.log(`Could not find section for given key: ${this.type}`);
        return (
          <div
            class="w-full p-4 md:p-5 lg:p-10 bg-gray-200 border-gray-400 border-b border-t text-sm"
            data-preview-id={this.previewId}
          >
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
                      previewId: this.previewId
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
    return (
      <div data-preview-id={this.previewId}>
        <Component payload={this.data} previewId={this.previewId} />
      </div>
    );
  }

  render() {
    if (!this.data) return null;
    // TODO: Should we even render this kind of information if we are not in preview-mode?
    if (!this.isEditMode) return this.renderSection();
    return <div data-preview-id={this.previewId}>{this.renderSection()}</div>;
  }
}
export default Section;
