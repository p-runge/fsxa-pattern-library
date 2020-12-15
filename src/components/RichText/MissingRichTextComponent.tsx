import { FSXA_INJECT_KEY_SET_PORTAL_CONTENT } from "@/constants";
import { RichTextElement } from "fsxa-api/dist/types";
import Component from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
import BaseComponent from "../base/BaseComponent";
import Code from "../internal/Code";
import InfoBox from "../internal/InfoBox";
import TabbedContent from "../internal/TabbedContent";

interface MissingRichTextComponentProps {
  element: RichTextElement;
}
@Component({
  name: "MissingRichTextComponent",
})
class MissingRichTextComponent extends BaseComponent<
  MissingRichTextComponentProps
> {
  @Prop({ required: true }) element!: MissingRichTextComponentProps["element"];
  @Inject({
    from: FSXA_INJECT_KEY_SET_PORTAL_CONTENT,
    default: () => ({}),
  })
  setPortalContent!: (portalContent: any) => void;

  renderDevInfoPortal() {
    this.setPortalContent(
      <InfoBox
        headline="Missing RichText-Component"
        type="info"
        isOverlay={true}
        handleClose={() => this.setPortalContent(null)}
        subheadline={
          <span>
            We were unable to find a mapped RichText-Component for the given
            key: <span class="font-bold">{this.element.type}</span>
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
      "${this.element.type}": YourCustomRichTextComponent,
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
                    {JSON.stringify(this.element.data, null, 2)}
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
${JSON.stringify(this.element.content, null, 2)}
`}
                  </Code>
                ),
              },
            ]}
          />
        </div>
      </InfoBox>,
    );
  }

  render() {
    if (!this.isDevMode) return null;
    return (
      <span class="block my-2">
        <a
          href="#"
          class="group-r inline-flex pl-1 py-1 bg-blue-200 rounded-lg group  border border-blue-400 hover:bg-blue-100 text-sm text-blue-900 font-sans items-center justify-center"
          onClick={event => {
            event.preventDefault();
            this.renderDevInfoPortal();
          }}
        >
          <span class="flex w-6 h-6 items-center justify-center bg-blue-500 text-gray-100 rounded-full group-r-hover:bg-blue-400">
            ?
          </span>
          <span class="inline-block text-xs px-2">
            <span>Missing RichText-Component:</span>
            <strong class="inline-block ml-1">{this.element.type}</strong>
          </span>
        </a>
      </span>
    );
  }
}
export default MissingRichTextComponent;
