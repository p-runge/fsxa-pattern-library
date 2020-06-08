import Component from "vue-class-component";
import FSXABaseSection from "./FSXABaseSection";
import { Sections } from "fsxa-ui";

export interface Payload {
  st_headline: string;
  st_jumbo_headline: string;
  st_kicker: string;
  st_picture: {
    previewId: string;
    src: string;
  };
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
  imageSrc: string | null = null;

  async fetchImageData() {
    // fetch logo
    if (this.payload.st_picture.src && !this.imageSrc) {
      this.imageSrc = await this.fetchImage(
        this.payload.st_picture.src,
        "ORIGINAL",
      );
    }
  }

  mounted() {
    this.fetchImageData();
  }

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
          src: this.imageSrc || "",
          previewId: this.payload.st_picture.previewId || "",
        }}
      />
    );
  }
}
export default FSXAWelcomeSection;
