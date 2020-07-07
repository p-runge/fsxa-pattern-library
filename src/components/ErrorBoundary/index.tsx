import FSXABaseComponent from "../FSXABaseComponent";
import Component from "vue-class-component";
import { FSXADevInfo, FSXACode } from "fsxa-ui";
import { Prop } from "vue-property-decorator";

export interface ErrorBoundaryProps {
  title: string;
  additionalInfo?: JSX.Element;
}
@Component
class ErrorBoundary extends FSXABaseComponent<ErrorBoundaryProps> {
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
      <FSXADevInfo
        headline={this.title}
        devModeHint="This error message will only be displayed if DevMode is active"
      >
        Stack:
        {this.error.stack && <FSXACode code={this.error.stack} />}
        {this.additionalInfo}
      </FSXADevInfo>
    ) : (
      this.$slots.default
    );
  }
}
export default ErrorBoundary;
