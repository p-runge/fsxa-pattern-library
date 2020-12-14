import Component from "vue-class-component";
import { InjectReactive, Prop } from "vue-property-decorator";
import BaseComponent from "./base/BaseComponent";
import { AppComponents, RichTextProps } from "@/types/components";
import { VNode } from "vue";
import { RichTextElement } from "fsxa-api";
import { FSXA_INJECT_KEY_COMPONENTS } from "@/constants";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import TabbedContent from "./internal/TabbedContent";
@Component({
  name: "FSXARichText",
})
class RichText extends BaseComponent<RichTextProps, {}, Record<string, any>> {
  @Prop({ required: true }) content!: RichTextElement[];
  @InjectReactive({ from: FSXA_INJECT_KEY_COMPONENTS })
  components!: AppComponents;

  get elements(): Record<string, any> {
    return this.components.richtext || {};
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
        <InfoBox
          headline="Missing RichText-Component"
          type="info"
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
            Your custom RichText-Component will receive the following
            properties:
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
* Use an embedded FSXARichText component for rendering the child-elements
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
  }

  render() {
    return <div class="prose">{this.content.map(this.renderElement)}</div>;
  }
}
export default RichText;
