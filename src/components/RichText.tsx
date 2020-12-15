import Component from "vue-class-component";
import { Inject, InjectReactive, Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";
import { AppComponents, RichTextProps } from "@/types/components";
import { VNode } from "vue";
import { RichTextElement } from "fsxa-api";
import {
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
} from "@/constants";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import TabbedContent from "./internal/TabbedContent";
import { CreateElement, RenderContext } from "vue";

export const VNodeHelper = {
  functional: true,
  render: (h: CreateElement, ctx: RenderContext) => ctx.props.vnodes,
};

@Component({
  name: "FSXARichText",
})
class RichText extends BaseComponent<RichTextProps, {}, Record<string, any>> {
  @Prop({ required: true }) content!: RichTextElement;
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  get elements(): Record<string, any> {
    return this.components.richtext || {};
  }

  renderDevInfoPortal(element: RichTextElement) {
    this.setPortalContent(this.renderDevInfo(element));
  }

  renderDevInfo(element: RichTextElement) {
    return (
      <InfoBox
        headline="Missing RichText-Component"
        type="info"
        isOverlay={true}
        handleClose={() => this.setPortalContent(null)}
        subheadline={
          <span>
            We were unable to find a mapped RichText-Component for the given
            key: <span class="font-bold">{element.type}</span>
          </span>
        }
      >
        <div>
          You can pass your own component by adding it to the{" "}
          <Code inline language="js">
            components
          </Code>{" "}
          map.
          <Code class="mt-4" language="tsx">
            {`import YourCustomRichTextComponent from "...";

<FSXAApp
  components={{
    richtext: {
      "${element.type}": YourCustomRichTextComponent,
    }
  }}
/>`}
          </Code>
          If you are not using the fsxa-pattern-library directly make sure to
          check the documentation of your project specific integration.
          <br />
          <br />
          You can extend the
          <Code class="mx-1" inline language="tsx">
            FSXABaseRichTextElement
          </Code>
          to get access to provided properties.
          <br />
          <br />
          Your custom RichText-Component will receive the following properties:
          <TabbedContent
            tabs={[
              {
                title: "data",
                content: (
                  <Code key="data" language="json">
                    {JSON.stringify(element.data, null, 2)}
                  </Code>
                ),
              },
              {
                title: "content",
                content: (
                  <Code key="content" language="tsx">
                    {`/**
* This property contains the JSON for the RichText-elements children.
* You can render it via the following methods:
**/

/**
 * Vue SFC:
 * The content component is already injected for you and will render the content elements for you
 **/
<render-content />

/**
 * JSX/TSX:
 * You can use the renderContent method provided by the FSXABaseRichTextElement
 **/
{this.renderContent()}

/**
 * Content-JSON
 **/
${JSON.stringify(this.content, null, 2)}
`}
                  </Code>
                ),
              },
            ]}
          />
        </div>
      </InfoBox>
    );
  }

  renderElement(
    element: RichTextElement,
  ): VNode[] | VNode | undefined | null | string {
    if (this.elements[element.type]) {
      const Element = this.elements[element.type];
      return <Element content={element.content} data={element.data} />;
    }
    if (this.isDevMode) {
      return (
        <span class="block my-2">
          <a
            href="#"
            class="group-r inline-flex pl-1 py-1 bg-blue-200 rounded-lg group  border border-blue-400 hover:bg-blue-100 text-sm text-blue-900 font-sans items-center justify-center"
            onClick={event => {
              event.preventDefault();
              this.renderDevInfoPortal(element);
            }}
          >
            <span class="flex w-6 h-6 items-center justify-center bg-blue-500 text-gray-100 rounded-full group-r-hover:bg-blue-400">
              ?
            </span>
            <span class="inline-block text-xs px-2">
              <span>Missing RichText-Component:</span>
              <strong class="inline-block ml-1">{element.type}</strong>
            </span>
          </a>
        </span>
      );
    }
    return null;
  }

  render() {
    const element = this.content;
    if (this.elements[element.type]) {
      const Element = this.elements[element.type];
      return <Element content={element.content} data={element.data} />;
    }
    if (this.isDevMode) {
      return (
        <span class="block my-2">
          <a
            href="#"
            class="group-r inline-flex pl-1 py-1 bg-blue-200 rounded-lg group  border border-blue-400 hover:bg-blue-100 text-sm text-blue-900 font-sans items-center justify-center"
            onClick={event => {
              event.preventDefault();
              this.renderDevInfoPortal(element);
            }}
          >
            <span class="flex w-6 h-6 items-center justify-center bg-blue-500 text-gray-100 rounded-full group-r-hover:bg-blue-400">
              ?
            </span>
            <span class="inline-block text-xs px-2">
              <span>Missing RichText-Component:</span>
              <strong class="inline-block ml-1">{element.type}</strong>
            </span>
          </a>
        </span>
      );
    }
    return null;
  }
}
export default RichText;
