import Sections from "./components";
import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import BaseComponent from "@/components/FSXABaseComponent";
import { FSXA_INJECT_KEY_SECTIONS } from "@/constants";
import { FSXADevInfo, FSXACode } from "fsxa-ui";
import ErrorBoundary from "../ErrorBoundary";

const getProgrammingHint = (type: string) => {
  return `<FSXAConfigProvider sections={{ ${type}: Your_Section_Component }}>
  <FSXAPage ...>
</FSXAConfigProvider>`;
};

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
          <FSXADevInfo
            headline={`Could not find registered Section: ${this.type}`}
            isOverlay={false}
            devModeHint="This information is only visible if DevMode is active"
          >
            You can easily register new Sections by providing a key-Component
            map to the FSXAProviderConfig
            <FSXACode
              code={getProgrammingHint(this.type)}
              language="typescript"
            />
            The following Payload will be passed to it:
            <FSXACode
              code={JSON.stringify(this.data, undefined, 2)}
              language="json"
            />
          </FSXADevInfo>
        );
      }
      return null;
    }
    return (
      <div class="relative" data-preview-id={this.previewId}>
        <Component payload={this.data} previewId={this.previewId} />
        {this.isDevMode && (
          <FSXADevInfo
            headline={`Section: ${this.type}`}
            isOverlay
            devModeHint="This information is only visible if DevMode is active"
          >
            The following payload is passed to the section:
            <FSXACode code={JSON.stringify(this.data, undefined, 2)} />
          </FSXADevInfo>
        )}
      </div>
    );
  }

  renderErrorBoundaryInfo() {
    return (
      <div>
        The following payload is passed to the section:
        <FSXACode code={JSON.stringify(this.data, undefined, 2)} />
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
export default FSXASection;
