import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "./../base/BaseComponent";

export interface InfoBoxProps {
  type: "info" | "error";
  headline: JSX.Element | string;
  isOverlay?: boolean;
  subheadline?: JSX.Element | string | null;
  handleClose?: () => void;
}
@Component({
  name: "InfoBox",
})
class InfoBox extends BaseComponent<InfoBoxProps> {
  @Prop({ required: true }) type!: InfoBoxProps["type"];
  @Prop({ required: true }) headline!: InfoBoxProps["headline"];
  @Prop() subheadline: InfoBoxProps["subheadline"];
  @Prop({ default: false }) isOverlay: InfoBoxProps["isOverlay"];
  @Prop() handleClose: InfoBoxProps["handleClose"];

  collapsed = false;

  render() {
    return (
      <div
        class={`pl-w-full ${
          this.isOverlay
            ? "pl-h-full pl-w-full lg:pl-w-12/12 xl:pl-w-3/4"
            : "pl-bg-gray-100"
        } pl-p-4 md:pl-p-6 lg:pl-p-10 pl-text-base`}
      >
        <div
          class={`pl-pointer-events-auto pl-w-full pl-max-h-full pl-rounded-lg pl-shadow-md pl-bg-white pl-border pl-flex pl-flex-col pl-items-center pl-justify-start pl-overflow-hidden ${
            this.type === "info" ? "pl-border-blue-400" : "pl-border-red-400"
          }`}
        >
          <div
            class={`pl-w-full pl-flex pl-items-center pl-justify-center pl-px-4 lg:pl-px-6 pl-py-3 lg:pl-py-5 ${
              this.collapsed ? "" : "pl-border-b"
            } ${
              this.type === "info"
                ? "pl-border-blue-400 pl-bg-blue-200 pl-text-blue-900"
                : "pl-border-red-400 pl-bg-red-200 pl-text-red-900"
            } pl-rounded-t-md`}
          >
            <div class="pl-flex-grow">
              <h3>{this.headline}</h3>
              <p class="pl-text-xs pl-mt-1">{this.subheadline}</p>
            </div>
            <div class="pl-flex-shrink-0 pl-ml-4">
              <a
                href="#"
                class={`pl-flex pl-items-center pl-justify-center pl-w-10 pl-h-10 hover:pl-bg-gray-200 pl-rounded-full pl-duration-200 pl-transition-transform pl-transform ${
                  this.collapsed ? "-pl-rotate-90" : ""
                }`}
                onClick={event => {
                  event.preventDefault();
                  if (this.isOverlay && this.handleClose) {
                    this.handleClose();
                  } else {
                    this.collapsed = !this.collapsed;
                  }
                }}
              >
                <svg
                  class="pl-w-6 pl-h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {this.isOverlay ? (
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  ) : (
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  )}
                </svg>
              </a>
            </div>
          </div>
          {!this.collapsed && (
            <div
              class={`pl-w-full pl-px-4 lg:pl-px-6 pl-py-3 lg:pl-py-5 pl-text-sm ${
                this.isOverlay ? "pl-overflow-x-auto pl-flex-grow" : ""
              }`}
            >
              {this.$slots.default}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default InfoBox;
