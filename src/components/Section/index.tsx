import Sections from "./components";
import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent";
import { FSXA_INJECT_KEY_SECTIONS } from "@/constants";
import { DevInfo, Code } from "fsxa-ui";
import ErrorBoundary from "../ErrorBoundary";

const getProgrammingHint = (type: string) => {
  return `<FSXAPage sections={{ ${type}: Your_Section_Component }} />`;
};

export interface SectionProps {
  id?: string;
  previewId?: string;
  type: string;
  data: any;
  content: any;
}
@Component({
  name: "FSXASection",
})
class Section extends BaseComponent<SectionProps> {
  @Inject({ from: FSXA_INJECT_KEY_SECTIONS, default: {} }) sections!: {};
  @Prop() id!: SectionProps["id"];
  @Prop() previewId!: SectionProps["previewId"];
  @Prop({ required: true }) type!: SectionProps["type"];
  @Prop({ required: true }) data!: SectionProps["data"];
  @Prop({ required: true }) content!: SectionProps["content"];

  get mappedSections(): { [key: string]: any } {
    return {
      ...Sections,
      ...this.sections,
    };
  }

  get mappedComponent() {
    return this.mappedSections[this.type];
  }

  renderSection() {
    if (!this.data) return null;
    const Component = this.mappedComponent;
    if (!Component) {
      if (this.isDevMode) {
        console.log(`Could not find section for given key: ${this.type}`);
        return (
          <DevInfo
            headline={`Could not find registered Section: ${this.type}`}
            isOverlay={false}
            devModeHint="This information is only visible if DevMode is active"
          >
            You can easily register new Sections by providing a key-Component
            map to your FSXAPage
            <Code code={getProgrammingHint(this.type)} language="typescript" />
            <br />
            The following Payload will be passed to it:
            <Code
              code={JSON.stringify(this.data, undefined, 2)}
              language="json"
            />
          </DevInfo>
        );
      }
      return null;
    }
    return (
      <div class="relative" data-preview-id={this.previewId}>
        <Component
          payload={this.data}
          previewId={this.previewId}
          content={this.content}
        />
        {this.isDevMode && (
          <DevInfo
            headline={`Section: ${this.type}`}
            isOverlay
            devModeHint="This information is only visible if DevMode is active"
          >
            The following payload is passed to the section:
            <Code code={JSON.stringify(this.data, undefined, 2)} />
          </DevInfo>
        )}
      </div>
    );
  }

  renderErrorBoundaryInfo() {
    return (
      <div>
        The following payload is passed to the section:
        <Code code={JSON.stringify(this.data, undefined, 2)} />
      </div>
    );
  }

  render() {
    if (!this.data) return null;
    return (
      <ErrorBoundary
        title={`Error rendering Section: ${this.mappedComponent &&
          this.mappedComponent.name}`}
        additionalInfo={this.renderErrorBoundaryInfo()}
      >
        {this.renderSection()}
      </ErrorBoundary>
    );
  }
}
export default Section;
