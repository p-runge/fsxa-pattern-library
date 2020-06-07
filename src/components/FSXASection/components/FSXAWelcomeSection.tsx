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

  serverPrefetch() {
    return this.fetchData();
  }

  mounted() {
    this.fetchData();
  }

  async fetchData() {
    return this.fetchImage(this.payload.st_picture.src, "ORIGINAL");
  }

  get image(): string | null {
    return this.getImage(this.payload.st_picture.src, "ORIGINAL");
  }

  render() {
    console.log(this.payload);
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
          src: this.image || "",
          previewId: this.payload.st_picture.previewId || "",
        }}
      />
    );
  }
}
export default FSXAWelcomeSection;
