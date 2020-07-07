import Component from "vue-class-component";
import FSXABaseSection from "./FSXABaseSection";
import { Sections } from "fsxa-ui";
import { CAASImageReference } from "fsxa-api";

export interface Payload {
  st_headline: string;
  st_jumbo_headline: string;
  st_kicker: string;
  st_picture?: CAASImageReference;
  st_picture_alt: string | null;
  st_text: string;
  st_button?: {
    data: {
      lt_button_text: string;
      lt_internal: {
        referenceId: string;
        referenceType: string;
      };
    };
  };
}
@Component({
  name: "FSXAWelcomeSection",
})
class FSXAWelcomeSection extends FSXABaseSection<Payload> {
  render() {
    return (
      <Sections.WelcomeSection
        headline={this.payload.st_headline}
        jumboHeadline={this.payload.st_jumbo_headline}
        kicker={this.payload.st_kicker}
        text={this.payload.st_text}
        buttonText={this.payload.st_button?.data.lt_button_text}
        handleButtonClick={() => {
          this.handleRouteChangeRequest({
            pageId: this.payload.st_button?.data.lt_internal.referenceId,
          });
        }}
        image={{
          src: this.payload.st_picture?.resolutions.ORIGINAL.url || "",
          previewId: this.payload.st_picture?.previewId || "",
        }}
      />
    );
  }
}
export default FSXAWelcomeSection;
