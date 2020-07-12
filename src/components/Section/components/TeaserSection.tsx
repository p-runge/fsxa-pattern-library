import Component from "vue-class-component";
import BaseSection from "./BaseSection";
import { Sections } from "fsxa-ui";
import { CAASImageReference } from "fsxa-api";
import { ImageRef } from "fsxa-ui/src/types/utils";

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
class TeaserSection extends BaseSection<Payload> {
  render() {
    const imageRef: ImageRef | undefined = this.payload.st_picture
      ? {
          src: this.payload.st_picture.resolutions.ORIGINAL.url,
          dimensions: {
            width: this.payload.st_picture.resolutions.ORIGINAL.width,
            height: this.payload.st_picture.resolutions.ORIGINAL.height,
          },
          previewId: this.payload.st_picture.previewId,
        }
      : undefined;
    return (
      <Sections.TeaserSection
        headline={this.payload.st_headline}
        kicker={this.payload.st_kicker}
        text={this.payload.st_text}
        buttonText={this.payload.st_button?.data.lt_button_text}
        handleButtonClick={() => {
          this.handleRouteChangeRequest({
            pageId: this.payload.st_button?.data.lt_internal.referenceId,
          });
        }}
        image={imageRef}
      />
    );
  }
}
export default TeaserSection;
