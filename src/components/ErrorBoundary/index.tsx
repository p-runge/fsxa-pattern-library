import BaseComponent from "@/components/BaseComponent";
import { DevInfo, Code } from "fsxa-ui";
import { Prop, Component } from "vue-property-decorator";

export interface ErrorBoundaryProps {
  title: string;
  additionalInfo?: JSX.Element;
}
@Component
class ErrorBoundary extends BaseComponent<ErrorBoundaryProps> {
  @Prop({ required: true }) title!: ErrorBoundaryProps["title"];
  @Prop() additionalInfo: ErrorBoundaryProps["additionalInfo"];

  error: Error | null = null;

  errorCaptured(error: Error) {
    this.error = error;
    return false;
  }

  render() {
    if (this.error && !this.isDevMode) {
      return null;
    }
    return this.error ? (
      <DevInfo
        headline={this.title}
        devModeHint="This error message will only be displayed if DevMode is active"
      >
        Stack:
        {this.error.stack && <Code code={this.error.stack} />}
        {this.additionalInfo}
      </DevInfo>
    ) : (
      this.$slots.default
    );
  }
}
export default ErrorBoundary;
