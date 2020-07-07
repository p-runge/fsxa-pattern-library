import Component from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import Layouts from "./components";
import { FSXA_INJECT_KEY_LAYOUTS } from "@/constants";
import FSXABaseComponent from "@/components/FSXABaseComponent";
import { FSXALayoutProps } from "@/types/components";
import { FSXADevInfo, FSXACode } from "fsxa-ui";
import ErrorBoundary from "../ErrorBoundary";

const getProgrammingHint = (type: string) => {
  return `<FSXAConfigProvider sections={{ ${type}: Your_Section_Component }}>
  <FSXAPage ...>
</FSXAConfigProvider>`;
};

const getDevModeContent = (key: string, code: string) => {
  return `// ${key}
${code}`;
};

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

  renderDevInfo() {
    return (
      <div>
        The following Data, Meta and Content will be passed to it:
        <FSXACode
          code={getDevModeContent(
            "data",
            JSON.stringify(this.data, undefined, 2),
          )}
          language="json"
        />
        <FSXACode
          code={getDevModeContent(
            "meta",
            JSON.stringify(this.meta, undefined, 2),
          )}
          language="json"
        />
        <FSXACode
          code={getDevModeContent(
            "content",
            JSON.stringify(this.content, undefined, 2),
          )}
          language="json"
        />
      </div>
    );
  }

  render() {
    const Layout = this.mappedLayouts[this.type];
    if (!Layout) {
      if (this.isDevMode) {
        console.log(`Could not find layout for given key: ${this.type}`);
        return (
          <FSXADevInfo
            headline={`Could not find registered Layout: ${this.type}`}
            isOverlay={false}
            devModeHint="This information is only visible if DevMode is active"
          >
            You can easily register new Layouts by providing a key-Component map
            to the FSXAConfigProvider
            <FSXACode
              code={getProgrammingHint(this.type)}
              language="typescript"
            />
            {this.renderDevInfo()}
          </FSXADevInfo>
        );
      }
      return null;
    }
    return (
      <ErrorBoundary
        title={`Error rendering Layout: ${Layout && Layout.name}`}
        additionalInfo={this.renderDevInfo()}
      >
        <div class="relative">
          <Layout
            content={this.content}
            data={this.data}
            meta={this.meta}
            pageId={this.pageId}
          />
          {this.isDevMode && (
            <FSXADevInfo
              headline={`Layout: ${this.type}`}
              isOverlay
              devModeHint="This information is only visible if DevMode is active"
            >
              {this.renderDevInfo()}
            </FSXADevInfo>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}
export default FSXALayout;
